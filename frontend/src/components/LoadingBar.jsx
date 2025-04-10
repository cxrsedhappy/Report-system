function LoadingBar({ isLoading }) {
    return (
        <div
            className={`fixed top-0 left-0 h-1 bg-accent transition-all duration-500 ${isLoading ? "w-full" : "w-0"}`}
            style={{ zIndex: 1000 }}
        ></div>

    );
}

export default LoadingBar;