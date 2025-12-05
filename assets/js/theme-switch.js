// Split Layout Interaction
(function ($) {

    const $body = $('body');
    const $sides = $('.split-side');
    const $closeBtn = $('<button class="close-btn">&times;</button>');

    // Add close button to body
    $body.append($closeBtn);

    // Handle Side Click / Toggle
    function activateSide(side) {
        // If already active, do nothing
        if ($('#side-' + side).hasClass('active')) return;

        // Set body and html state
        $body.addClass('mode-active');
        $('html').addClass('mode-active');

        // Reset classes
        $sides.removeClass('active inactive');

        // Set active/inactive
        $('#side-' + side).addClass('active');

        // The other side becomes inactive
        const otherSide = side === 'professional' ? 'personal' : 'professional';
        $('#side-' + otherSide).addClass('inactive');
    }

    function resetLayout() {
        $body.removeClass('mode-active');
        $('html').removeClass('mode-active');
        $sides.removeClass('active inactive');
    }

    // Event Listeners

    // Click on side (desktop)
    $sides.on('click', function (e) {
        // Only activate if not already active
        if (!$(this).hasClass('active')) {
            const side = $(this).attr('id').replace('side-', '');
            activateSide(side);
        }
    });

    // Click on toggle buttons (mobile/desktop)
    $('.btn-toggle').on('click', function (e) {
        e.stopPropagation(); // Prevent bubbling to side click
        const target = $(this).data('target');
        activateSide(target);
    });

    // Close button
    $closeBtn.on('click', function () {
        resetLayout();
    });

    // Keyboard 'Esc' to close
    $(document).on('keydown', function (e) {
        if (e.key === "Escape" && $body.hasClass('mode-active')) {
            resetLayout();
        }
    });

})(jQuery);
