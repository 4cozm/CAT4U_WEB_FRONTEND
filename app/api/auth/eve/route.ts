import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 })
    }

    // EVE Online Token Exchange
    const tokenResponse = await fetch("https://login.eveonline.com/v2/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.EVE_CLIENT_ID}:${process.env.EVE_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange authorization code")
    }

    const tokenData = await tokenResponse.json()

    // 캐릭터 정보 가져오기
    const characterResponse = await fetch("https://login.eveonline.com/oauth/verify", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!characterResponse.ok) {
      throw new Error("Failed to get character information")
    }

    const characterData = await characterResponse.json()

    // 추가 캐릭터 정보 가져오기 (ESI API)
    const esiResponse = await fetch(`https://esi.evetech.net/latest/characters/${characterData.CharacterID}/`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    let corporationName = "Unknown Corporation"
    let allianceName = null

    if (esiResponse.ok) {
      const esiData = await esiResponse.json()

      // 코퍼레이션 정보 가져오기
      const corpResponse = await fetch(`https://esi.evetech.net/latest/corporations/${esiData.corporation_id}/`)
      if (corpResponse.ok) {
        const corpData = await corpResponse.json()
        corporationName = corpData.name

        // 얼라이언스 정보 가져오기 (있는 경우)
        if (corpData.alliance_id) {
          const allianceResponse = await fetch(`https://esi.evetech.net/latest/alliances/${corpData.alliance_id}/`)
          if (allianceResponse.ok) {
            const allianceData = await allianceResponse.json()
            allianceName = allianceData.name
          }
        }
      }
    }

    const result = {
      character_id: characterData.CharacterID,
      character_name: characterData.CharacterName,
      corporation_name: corporationName,
      alliance_name: allianceName,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("EVE Auth Error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
