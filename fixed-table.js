function fixTable() {
  // Store references to table elements
  var container = document.getElementById('fixed-table-container');
  var thead = container.querySelector('thead');
  var tbody = container.querySelector('tbody');

  // Style container
  container.style.overflow = 'auto';
  container.style.position = 'relative';

  // Add inline styles to fix the header row and leftmost column
  function updateTableStyles() {
    var ths = thead.querySelectorAll('th');
    var tbodyTrs = tbody.querySelectorAll('tr')

    /**
     * Remove inline styles so we resort to the default table layout algorithm
     * For thead, th, and td elements, don't remove the 'transform' styles applied
     * by the scroll event listener
     */
    tbody.setAttribute('style', '');
    thead.style.width = '';
    thead.style.position = '';
    thead.style.top = '';
    thead.style.left = '';
    thead.style.zIndex = '';
    ths.forEach(function(th) {
      th.style.display = '';
      th.style.width = '';
      th.style.position = '';
      th.style.top = '';
      th.style.left = '';
    });
    tbodyTrs.forEach(function(tr) {
      tr.setAttribute('style', '');
      tr.querySelectorAll('td').forEach(function(td) {
        td.style.width = '';
        td.style.position = '';
        td.style.left = '';
      });
    });

    /**
     * Store width and height of each th
     * getBoundingClientRect()'s dimensions include paddings and borders
     */
    var thStyles = [].slice.call(ths).map(function(th) {
      var rect = th.getBoundingClientRect();
      var style = document.defaultView.getComputedStyle(th, '');
      return {
        boundingWidth: rect.width,
        boundingHeight: rect.height,
        width: parseInt(style.width, 10),
        paddingLeft: parseInt(style.paddingLeft, 10)
      };
    });

    // Set widths of thead and tbody
    var totalWidth = thStyles.reduce(function(sum, cur) { return sum + cur.boundingWidth; }, 0);
    tbody.style.display = 'block';
    tbody.style.width = totalWidth + 'px';
    thead.style.width = totalWidth - thStyles[0].boundingWidth + 'px';

    // Position thead
    thead.style.position = 'absolute';
    thead.style.top = '0';
    thead.style.left = thStyles[0].boundingWidth + 'px';
    thead.style.zIndex = 10;

    // Set widths of the th elements in thead. For the fixed th, set its position
    ths.forEach(function(th, i) {
      th.style.width = thStyles[i].width + 'px';
      if (i === 0) {
        th.style.position = 'absolute';
        th.style.top = '0';
        th.style.left = -thStyles[0].boundingWidth + 'px';
      }
    });

    // Set margin-top for tbody - the fixed header is displayed in this margin
    tbody.style.marginTop = thStyles[0].boundingHeight + 'px';

    // Set widths of the td elements in tbody. For the fixed td, set its position
    tbodyTrs.forEach(function(tr, i) {
      tr.style.display = 'block';
      tr.style.paddingLeft = thStyles[0].boundingWidth + 'px';
      tr.querySelectorAll('td').forEach(function(td, j) {
        td.style.width = thStyles[j].width + 'px';
        if (j === 0) {
          td.style.position = 'absolute';
          td.style.left = '0';
        }
      });
    });
  }

  // Initialize table styles
  updateTableStyles();

  // Update table cell dimensions on resize
  window.addEventListener('resize', resizeThrottler, false);
  var resizeTimeout;
  function resizeThrottler() {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        updateTableStyles();
      }, 500);
    }
  }

  // Fix thead and first column on scroll
  container.addEventListener('scroll', function() {
    thead.style.transform = 'translate3d(0,' + this.scrollTop + 'px,0)';
    var hTransform = 'translate3d(' + this.scrollLeft + 'px,0,0)';
    thead.querySelector('th').style.transform = hTransform;
    tbody.querySelectorAll('tr > td:first-child').forEach(function(td, i) {
      td.style.transform = hTransform;
    });
  });
}
