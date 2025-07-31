let songData = [];
let pageSize = 25;
let currentPage = 1;

$(document).ready(function () {
  $.getJSON('/api/data.json', function (data) {
    songData = data;
    updateSongList();
    renderPagination();
  });

  $('#search-input').on('input', function () {
    currentPage = 1;
    updateSongList();
    renderPagination();
  });
});

// Ini boleh di luar document.ready karena pakai variabel global
function updateSongList() {
  const searchInput = $('#search-input').val().toLowerCase();
  const filteredData = songData.filter((item) => item.artist.toLowerCase().includes(searchInput) || item.song.toLowerCase().includes(searchInput));

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const songList = $('#song-list');
  songList.empty();

  paginatedData.forEach((item) => {
    const songItem = $('<div>').addClass('song-item');

    const songLink = $('<a>')
      .attr({
        href: `lyrics-layout.html?artist=${encodeURIComponent(item.artist)}&song=${encodeURIComponent(item.song)}&lyrics=${encodeURIComponent((item.lyrics || '').trim())}`,
        target: '_blank',
        rel: 'noopener noreferrer',
      })
      .text(`${item.artist} - ${item.song}`);

    songItem.append(songLink);
    songList.append(songItem);
  });
}

function renderPagination() {
  const searchInput = $('#search-input').val().toLowerCase();
  const filteredData = songData.filter((item) => item.artist.toLowerCase().includes(searchInput) || item.song.toLowerCase().includes(searchInput));

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginationContainer = $('#pagination');
  paginationContainer.empty();

  if (totalPages <= 1 && totalItems <= pageSize) {
    // Tampilkan info total data walau tidak ada pagination
    paginationContainer.append($('<span>').text(`Total Data: ${totalItems}`));
    return;
  }

  const prevBtn = $('<button>')
    .text('Previous')
    .prop('disabled', currentPage === 1);
  const nextBtn = $('<button>')
    .text('Next')
    .prop('disabled', currentPage === totalPages);

  prevBtn.on('click', function () {
    if (currentPage > 1) {
      currentPage--;
      updateSongList();
      renderPagination();
    }
  });

  nextBtn.on('click', function () {
    if (currentPage < totalPages) {
      currentPage++;
      updateSongList();
      renderPagination();
    }
  });

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  paginationContainer.append(prevBtn);
  paginationContainer.append($('<span>').text(` Showing ${startItem} to ${endItem} of ${totalItems} songs `));
  paginationContainer.append(nextBtn);
}
