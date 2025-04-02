const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 w-full"> 
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-2 md:mb-0"> 
          <h2 className="text-lg font-semibold">Docxify</h2>
          <p className="text-sm">Advanced AI Doc Reader</p>
          <p className="text-xs mt-1">&copy; 2025 Docxify. All Rights Reserved</p>
        </div>
        <div className="flex space-x-8 text-sm text-center">
          <div>
            <h3 className="font-semibold">Product</h3>
            <ul>
              <li><a href="#" className="hover:text-gray-400">Overview</a></li>
              <li><a href="#" className="hover:text-gray-400">Features</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul>
              <li><a href="#" className="hover:text-gray-400">About Us</a></li>
              <li><a href="#" className="hover:text-gray-400">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Resources</h3>
            <ul>
              <li><a href="#" className="hover:text-gray-400">Blog</a></li>
              <li><a href="#" className="hover:text-gray-400">Newsletter</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
