import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  SlidersHorizontal,
  BadgeCheck
} from "lucide-react"

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r flex flex-col">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b font-semibold text-lg">
        Dakara
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 text-gray-700">

        <div className="space-y-1">

          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/products"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
          >
            <Package size={18} />
            Products
          </Link>

          <Link
            to="/categories"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
          >
            <FolderTree size={18} />
            Categories
          </Link>

          <Link
            to="/attributes"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
          >
            <SlidersHorizontal size={18} />
            Attributes
          </Link>

          <Link
            to="/brands"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100"
          >
            <BadgeCheck size={18} />
            Brands
          </Link>

        </div>

      </nav>

    </div>
  )
}
