

$(function() {
  var search = document.getElementById('search-bar')
  search.addEventListener('input',hitSoundCloud)
})

var hitSoundCloud = function(inputEvent) {
  var query = inputEvent.target.value
  getSoundCloudData(query)
}

var getSoundCloudData = function(queryString) {
  $.ajax({
    url: '/search',
    type: 'POST',
    data: {query: queryString},
    success: appendResults
  })
}

var appendResults = function() {
  alert('raorao')
}
