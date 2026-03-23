export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              EVo Auto Drive 🚗
            </span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} EVo Auto Drive, Inc. All rights reserved. ศูนย์รวมรถยนต์ไฟฟ้ามือสองคุณภาพ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
