function Footer() {
    return (
        <footer className='bg-gray-800 text-gray-400 py-6'>
            <div className='container mx-auto flex flex-col md:flex-row items-center justify-between px-4'>
                <h2 className='text-2xl font-bold text-white'>WatchStore</h2>
                <ul className='flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0'>
                    <li><a href='#' className='hover:text-white transition'>Home</a></li>
                    <li><a href='#' className='hover:text-white transition'>About Us</a></li>
                    <li><a href='#' className='hover:text-white transition'>Contact</a></li>
                </ul>
            </div>
            <div className='text-center text-sm text-gray-500 mt-6'>
                © {new Date().getFullYear()} WatchStore. All rights reserved.
            </div>
        </footer>

    );
}

export default Footer;