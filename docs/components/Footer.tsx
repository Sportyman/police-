import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-6 text-center">
                <p>&copy; {new Date().getFullYear()} הלוחם - ציוד טקטי. כל הזכויות שמורות.</p>
                <p className="text-sm text-gray-400 mt-1">נוצר עבור שוטרים, על ידי שוטרים.</p>
            </div>
        </footer>
    );
};

export default Footer;