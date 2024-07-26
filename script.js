        // Smooth Scrolling
        document.querySelectorAll('nav ul li a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!href.startsWith('Portfolio/')) { // Only prevent default for internal links, not external ones
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });





        // Initialize AOS
        AOS.init();