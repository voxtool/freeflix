const API_KEY = process.env.REACT_APP_API_KEY || 'fd98490ca4d66441463e2554300557f4';

const requests = {
    trending: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=en-US`,
    topRated: `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    action: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`,
    drama: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=18`,
    thriller: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=53`,
    comedy: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`,
    horror: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`,
    romance: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    documentary: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=99`,
    searchByWord: `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US`,
    detailsStart: `https://api.themoviedb.org/3/movie/`,
    detailsEnd: `?api_key=${API_KEY}&language=en-US&append_to_response=videos`,
    imageBaseUrl:'https://image.tmdb.org/t/p/original',
    imageBaseUrlSmall: 'https://image.tmdb.org/t/p/w500'
}

export default requests;