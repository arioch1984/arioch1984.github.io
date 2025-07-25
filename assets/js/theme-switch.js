// Theme Switch Functionality
(function($) {
    // Function to set theme
    function setTheme(themeName) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
        updateCheckbox(themeName);
    }

    // Function to toggle between light and dark themes
    function toggleTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    }

    // Function to update checkbox state and label
    function updateCheckbox(themeName) {
        const checkbox = document.getElementById('checkbox');
        const themeLabel = document.querySelector('.theme-label');

        if (checkbox) {
            checkbox.checked = themeName === 'dark';
        }

        if (themeLabel) {
            themeLabel.textContent = themeName === 'dark' ? 'Dark' : 'Light';
        }
    }

    // Function to get system preference
    function getSystemPreference() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Function to set cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    // Function to get cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Initialize theme
    $(document).ready(function() {
        // Check for saved theme preference or get from browser
        const savedTheme = getCookie('theme') || localStorage.getItem('theme');

        if (savedTheme) {
            // If we have a saved preference, use it
            setTheme(savedTheme);
        } else {
            // Otherwise, use system preference
            const systemPreference = getSystemPreference();
            setTheme(systemPreference);
        }

        // Set up event listener for theme switch
        $('#checkbox').change(function() {
            toggleTheme();
            // Save preference in cookie (valid for 365 days)
            setCookie('theme', localStorage.getItem('theme'), 365);
        });

        // Listen for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                // Only change theme if user hasn't set a preference
                if (!getCookie('theme') && !localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    });

})(jQuery);
