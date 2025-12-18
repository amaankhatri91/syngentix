import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-10 bg-white shadow-md text-black py-1 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Seepossible. All rights reserved.
        </p>
        <div className="mt-2">
            <a 
              href="https://www.seepossible.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-black hover:text-blue-400 mx-2"
            >
              About
            </a>
            <a 
              href="https://www.seepossible.com/contact-us" 
              target="_blank" 
              rel="noopener noreferrer" 
            className="text-black hover:text-blue-400 mx-2"
          >
            Contact
          </a>
          <a 
            href="https://www.seepossible.com/privacy-policy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-black hover:text-blue-400 mx-2"
          >
             Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
