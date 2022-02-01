

var mediumTopArtists = [];
var longTopArtists = [];
var shortTopArtists = [];
var mediumTopSongs = [];
var longTopSongs = [];
var shortTopSongs = [];
let topGenres = [];
let artistChart;
let songChart;





init();


function init() {
    if (localStorage.getItem('access_token') == null) {
        location.replace('dashboard.html');
    } else {
        let access_token = localStorage.getItem('access_token')
        if (sessionStorage.getItem("long_term") == null) {
            console.log("getting data")
            getTopArtists(access_token, "medium_term");
            getTopArtists(access_token, "short_term");
            getTopArtists(access_token, "long_term");
            getTopSongs(access_token, "medium_term");
            getTopSongs(access_token, "short_term");
            getTopSongs(access_token, "long_term");
        }else{

            shortTopArtists = JSON.parse(sessionStorage.getItem("short_term"));
            mediumTopArtists = JSON.parse(sessionStorage.getItem("medium_term"));
            longTopArtists = JSON.parse(sessionStorage.getItem("long_term"));
            shortTopSongs = JSON.parse(sessionStorage.getItem("short_term_song"));
            mediumTopSongs = JSON.parse(sessionStorage.getItem("medium_term_song"));
            longTopSongs = JSON.parse(sessionStorage.getItem("long_term_song"));

        }


    }
}


function fillArtistsPage(term) {
    let referenceArtist = [];
    setArtistChart(term);
    document.getElementById('artists').innerHTML = '';
    document.getElementById('popArtist').innerHTML = '';
    document.getElementById('genre').innerHTML = '';
    let topGenres = getTopGenres(term);
    switch(term) {
        case "short_term":
            referenceArtist = shortTopArtists;
            break;
        case "medium_term":
            referenceArtist = mediumTopArtists;
            break;
        case "long_term":
            referenceArtist = longTopArtists;
            break;
        default:
    }

    console.log(topGenres);
    referenceArtist.forEach( (artist, index) => {

        var div = htmlToElement('<div class="admin d-flex align-items-center rounded-2 p-3 mb-4"><div class="img"><img id="top1Pic" class="img-fluid rounded-pill top-artists"width="75" height="75" src="'+artist.image+'" alt="artist"></div><div class="ms-3"><h1 class="rank">'+(index+1)+'</h1></div><div class="ms-3"><h3 class="fs-5 mb-1" id="' + artist.id + '">'+artist.name+'</h3><p class="mb-0" id="top1Desc">'+artist.genres.join(", ")+'</p></div></div>');
        document.getElementById('artists').appendChild(div);
    });

    let sortedArtists = [...referenceArtist].sort((a, b) => (a.popularity < b.popularity) ? 1 : -1)
    var div = htmlToElement('<div class="admin d-flex align-items-center rounded-2 p-3 mb-4"><div class="img"><img class="img-fluid rounded-pill top-artists"width="75" height="75" src="'+sortedArtists.at(-1).image+'" alt="artist"></div><div class="ms-3"><h1 class="rank"></h1></div><div class="ms-3"><h3 class="fs-5 mb-1" id="' + sortedArtists.at(-1).id + '">'+sortedArtists.at(-1).name+' - '+ sortedArtists.at(-1).popularity+'</h3><p class="mb-0" id="top1Desc">Your least popular favorite artist</p></div></div>');
    document.getElementById('popArtist').appendChild(div);
    var div = htmlToElement('<div class="admin d-flex align-items-center rounded-2 p-3 mb-4"><div class="img"><img class="img-fluid rounded-pill top-artists"width="75" height="75" src="'+sortedArtists.at(0).image+'" alt="artist"></div><div class="ms-3"><h1 class="rank"></h1></div><div class="ms-3"><h3 class="fs-5 mb-1" id="' + sortedArtists.at(0).id + '">'+sortedArtists.at(0).name+' - '+ sortedArtists.at(0).popularity+'</h3><p class="mb-0" id="top1Desc">Your most popular favorite artist</p></div></div>');
    document.getElementById('popArtist').appendChild(div);

    let stats = htmlToElement('<div class="statis row"><div class="col-md-6 col-lg-3 mb-4 mb-lg-0"><div class="box bg-primary p-3"><i class="uil-eye"></i><h3>'+Object.keys(topGenres).length+'</h3><p class="lead">Different genres</p></div></div><div class="col-md-6 col-lg-3 mb-4 mb-lg-0"><div class="box bg-danger p-3"><i class="uil-user"></i><h3>'+Object.keys(topGenres).length+'</h3><p class="lead">User registered</p></div></div></div>');
    document.getElementById('genre').appendChild(stats);
    let genreDiv = htmlToElement('<div class="box" style="overflow-y:auto; height:250px" id="artists"></div>');

    topGenres.forEach((genre,index)=>{
        var div = htmlToElement('<div style="height: 50px; padding: 0px;" class="admin d-flex align-items-center rounded-2 p-3 mb-4"><div class="ms-3"><h1 class="no-margin rank">'+(index+1)+'</h1></div><div class="ms-3"><h3 class="no-margin fs-5 mb-1" id="' + genre + '">'+genre[0]+'</h3><p class="mb-0" id="top1Desc">'+genre[1]+' artists</p></div></div>');
        genreDiv.appendChild(div);
    });

    document.getElementById('popArtist').appendChild(genreDiv);

}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function fillData(term){
    if(document.getElementById('artists')!=null) {
        fillArtistsPage(term);
        //setChart(term);
    }
    if(document.getElementById('top1Name') != null) {
        fillSongs(term);
        fillArtists(term);
        setSongChart(term);
        setArtistChart(term);
        getTopGenres(term)
    }

}

function fillArtists(term){
    var referenceArtists;
    switch(term) {
        case "short_term":
            referenceArtists = shortTopArtists;
            break;
        case "medium_term":
            referenceArtists = mediumTopArtists;
            break;
        case "long_term":
            referenceArtists = longTopArtists;
            break;
        default:
        // code block
    }
    document.getElementById('top1Name').innerText = referenceArtists[0].name;
    document.getElementById('top1Pic').src = referenceArtists[0].image;
    document.getElementById('top1Desc').innerText = referenceArtists[0].followers.toLocaleString()+" followers";

    document.getElementById('top2Name').innerText = referenceArtists[1].name;
    document.getElementById('top2Pic').src = referenceArtists[1].image;
    document.getElementById('top2Desc').innerText = referenceArtists[1].followers.toLocaleString()+" followers";

    document.getElementById('top3Name').innerText = referenceArtists[2].name;
    document.getElementById('top3Pic').src = referenceArtists[2].image;
    document.getElementById('top3Desc').innerText = referenceArtists[2].followers.toLocaleString()+" followers";

    document.getElementById('top4Name').innerText = referenceArtists[3].name;
    document.getElementById('top4Pic').src = referenceArtists[3].image;
    document.getElementById('top4Desc').innerText = referenceArtists[3].followers.toLocaleString()+" followers";

    document.getElementById('top5Name').innerText = referenceArtists[4].name;
    document.getElementById('top5Pic').src = referenceArtists[4].image;
    document.getElementById('top5Desc').innerText = referenceArtists[4].followers.toLocaleString()+" followers";

    document.getElementById('top6Name').innerText = referenceArtists[5].name;
    document.getElementById('top6Pic').src = referenceArtists[5].image;
    document.getElementById('top6Desc').innerText = referenceArtists[5].followers.toLocaleString()+" followers";
}

function fillSongs(term){

    var referenceSongs;
    switch(term) {
        case "short_term":
            referenceSongs = shortTopSongs;
            break;
        case "medium_term":
            referenceSongs = mediumTopSongs;
            break;
        case "long_term":
            referenceSongs = longTopSongs;
            break;
        default:
        // code block
    }

    document.getElementById('song1Name').innerText = referenceSongs[0].name;
    document.getElementById('song1Pic').src = referenceSongs[0].image;
    document.getElementById('song1Desc').innerText = "popularity: "+referenceSongs[0].popularity;

    document.getElementById('song2Name').innerText = referenceSongs[1].name;
    document.getElementById('song2Pic').src = referenceSongs[1].image;
    document.getElementById('song2Desc').innerText = "popularity: "+referenceSongs[1].popularity;

    document.getElementById('song3Name').innerText = referenceSongs[2].name;
    document.getElementById('song3Pic').src = referenceSongs[2].image;
    document.getElementById('song3Desc').innerText = "popularity: "+referenceSongs[2].popularity;

    document.getElementById('song4Name').innerText = referenceSongs[3].name;
    document.getElementById('song4Pic').src = referenceSongs[3].image;
    document.getElementById('song4Desc').innerText = "popularity: "+referenceSongs[3].popularity;

    document.getElementById('song5Name').innerText = referenceSongs[4].name;
    document.getElementById('song5Pic').src = referenceSongs[4].image;
    document.getElementById('song5Desc').innerText = "popularity: "+referenceSongs[4].popularity;

    document.getElementById('song6Name').innerText = referenceSongs[5].name;
    document.getElementById('song6Pic').src = referenceSongs[5].image;
    document.getElementById('song6Desc').innerText = "popularity: "+referenceSongs[5].popularity;
}

function getTopArtists(access_token, term) {

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/artists?time_range='+term+'&limit=50',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {

            for (var i = 0; i < response.items.length; i++) {
                var artistJson = response.items[i];
                let artist ={name:artistJson.name, genres:artistJson.genres, popularity: artistJson.popularity, image: artistJson.images[0].url, id: artistJson.id, followers: artistJson.followers.total };


                switch(term) {
                    case "short_term":
                        shortTopArtists.push(artist);
                        break;
                    case "medium_term":
                        mediumTopArtists.push(artist);
                        break;
                    case "long_term":
                        longTopArtists.push(artist);
                        break;
                    default:
                    // code block
                }
            }

            fillArtists(term)

            switch(term) {
                case "short_term":
                    sessionStorage.setItem(term, JSON.stringify(shortTopArtists));
                    break;
                case "medium_term":
                    sessionStorage.setItem(term, JSON.stringify(mediumTopArtists));
                    break;
                case "long_term":
                    sessionStorage.setItem(term, JSON.stringify(longTopArtists));
                    break;
                default:
            }



        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        }
    });
}

function getTopSongs(access_token, term) {

    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/tracks?time_range='+term+'&limit=50',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {

            for (var i = 0; i < response.items.length; i++) {
                var songJson = response.items[i];
                let song ={name:songJson.name, popularity: songJson.popularity, image: songJson.album.images[2].url, id: songJson.id};


                switch(term) {
                    case "short_term":
                        shortTopSongs.push(song);
                        break;
                    case "medium_term":
                        mediumTopSongs.push(song);
                        break;
                    case "long_term":
                        longTopSongs.push(song);
                        break;
                    default:
                    // code block
                }
            }

            fillSongs(term)

            setSongChart(term);
            setArtistChart(term);
            switch(term) {
                case "short_term":
                    sessionStorage.setItem(term+"_song", JSON.stringify(shortTopSongs));
                    break;
                case "medium_term":
                    sessionStorage.setItem(term+"_song", JSON.stringify(mediumTopSongs));
                    break;
                case "long_term":
                    sessionStorage.setItem(term+"_song", JSON.stringify(longTopSongs));
                    break;
                default:
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        }
    });
}

function onTimeClicked(id, term){
    document.getElementById('short').classList.remove('selected');
    document.getElementById('medium').classList.remove('selected');
    document.getElementById('long').classList.remove('selected');
    document.getElementById(id).classList.add('selected');
    fillData(term);

}


function setSongChart(term){
    if(songChart != null) {
        songChart.destroy();
    }

    var referenceSongs =[];
    switch(term) {
        case "short_term":
            referenceSongs = shortTopSongs;
            referenceArtists = shortTopArtists;
            break;
        case "medium_term":
            referenceSongs = mediumTopSongs;
            referenceArtists = mediumTopArtists;
            break;
        case "long_term":
            referenceSongs = longTopSongs;
            referenceArtists = longTopArtists;
            break;
        default:
        // code block
    }

    let sortedSongs = [...referenceSongs].sort((a, b) => (a.popularity < b.popularity) ? 1 : -1)

    var songNames = sortedSongs.map(function(a) {return a.name.slice(0,15);});
    var songPopularity = sortedSongs.map(function(a) {return a.popularity;});
    //names.length = limit;
    //popularity.length = limit;
    //songNames.length =  limit;
    //songPopularity.length = limit;


    songChart = new Chart(document.getElementById('songChart'), {
        type: 'bar',
        data: {
            labels: songNames,
            datasets: [{
                label: "Popularity",
                data: songPopularity,
                backgroundColor: "#ad75b1",
                borderColor: 'transparent',
                borderWidth: 2.5,
                barPercentage: 0.4,
            }]
        },
        options: {
            legend:{
                labels:[{
                    padding: 0,
                }],
                display: false,
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        drawBorder: false,
                    },
                    ticks: {
                        stepSize: 10,
                        fontSize: 10,
                    },
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        fontSize: 8,
                    },
                }]
            }
        }
    })


}

function setArtistChart(term){
    if (artistChart != null) {
        artistChart.destroy();
    }


    var referenceArtists =[];
    switch(term) {
        case "short_term":
            referenceSongs = shortTopSongs;
            referenceArtists = shortTopArtists;
            break;
        case "medium_term":
            referenceSongs = mediumTopSongs;
            referenceArtists = mediumTopArtists;
            break;
        case "long_term":
            referenceSongs = longTopSongs;
            referenceArtists = longTopArtists;
            break;
        default:
        // code block
    }
    let canvas = document.getElementById('myChart');

    let sortedArtists = [...referenceArtists].sort((a, b) => (a.popularity < b.popularity) ? 1 : -1)
    var names = sortedArtists.map(function(a) {return a.name;});
    var popularity = sortedArtists.map(function(a) {return a.popularity;});

    artistChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: "Popularity",
                data: popularity,
                backgroundColor: "#ad75b1",
                borderColor: 'transparent',
                borderWidth: 2.5,
                barPercentage: 0.4,
            }]
        },
        options: {
            legend:{
                labels:[{
                    padding: 0,
                }],
                display: false,
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        drawBorder: false,
                    },
                    ticks: {
                        stepSize: 10,
                        fontSize: 10,
                    },
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        fontSize: 8,
                    },
                }]
            }
        }
    });


}

function getTopGenres(term){
    console.log("getting top genres");
    let list = [];
    switch(term) {
        case "short_term":
            list = shortTopArtists;
            break;
        case "medium_term":
            list = mediumTopArtists;
            break;
        case "long_term":
            list = longTopArtists;
            break;
        default:
        // code block
    }
    let genres = list.map(function(a) {return a.genres;});
    let allGenres = [];

    genres.forEach(element=>{
        allGenres = allGenres.concat(element);
    });


    const count = {};

    for (const element of allGenres) {
        if (count[element]) {
            count[element] += 1;
        } else {
            count[element] = 1;
        }
    }

    //topGenres=count;
    //sessionStorage.setItem('topGenres', topGenres);
    let rankedGenres =[];
    for (var genre in count) {
        rankedGenres.push([genre, count[genre]]);
    }
    rankedGenres.sort((a, b) => (a[1] < b[1]) ? 1 : -1)
    return rankedGenres;
}






