function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                    <div className="mb-4 md:mb-0">
                        <p className="">&copy; {new Date().getFullYear()} Фрагмент. Все права защищены.</p>
                    </div>
                    <span>Made with passion by Stanislaw</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
