import Link from "next/link"
import { Mail, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">E</span>
              </div>
              <h3 className="text-gray-900 font-semibold">EVE Community</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              EVE Online 한국 커뮤니티입니다.
              <br />
              가이드, 독트린, 피팅 정보를 공유하세요.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guide/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  가이드
                </Link>
              </li>
              <li>
                <Link href="/doctrine/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  독트린
                </Link>
              </li>
              <li>
                <Link href="/fitting/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  피팅
                </Link>
              </li>
              <li>
                <Link href="/market/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  장터
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">문의</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>admin@evecommunity.kr</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span>Discord 서버</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">&copy; 2024 EVE Community. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">
            EVE Online and the EVE logo are the registered trademarks of CCP hf.
          </p>
        </div>
      </div>
    </footer>
  )
}
