function Footer() {
    return (
        <footer className="bg-white shadow-inner mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Фрагмент. Все права защищены.</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-500 hover:text-indigo-600">
                            <i className="fas fa-question-circle"></i>
                            <span className="ml-1">Справка</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-indigo-600">
                            <i className="fas fa-envelope"></i>
                            <span className="ml-1">Поддержка</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-indigo-600">
                            <i className="fas fa-shield-alt"></i>
                            <span className="ml-1">Политика конфиденциальности</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
