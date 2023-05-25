import React, { Component } from 'react'
import axios from 'axios';
export default class Movies extends Component {

    constructor(){
        super();
        this.state={
            hover:'',
            parr: [1],
            currPage:1,
            movies:[],
            favourites:[]
        }
    }

    // Here, we make call to get first .data, so our data will be undefined but we want data, so will use async await.
    async componentDidMount(){
        // All the side effects work will be done in this function.
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=f37c83b063105423de0469d9de58928d&language=en-US&page=${this.state.currPage}`);
        let data = res.data;
        // console.log(data);
        this.setState({
            movies:[...data.results]
        })
        console.log('mounting done');
    }

    // This function is used to re render the page on the basis of the currPage our state is holding.
    // Here we, take res object from axios, which pulls data from our api, where in the last of url we have specified, currPage we want.
    // Finally put that data array which contains the currPage movies details, put it into the movies state.
    changeMovies = async () => {
        console.log("Change Movies Called");
        console.log(this.state.currPage);
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=f37c83b063105423de0469d9de58928d&language=en-US&page=${this.state.currPage}`);
        let data = res.data;
        // console.log(data);
        this.setState({
            movies: [...data.results]
        })
    }

    // This function definition is executed when we click on the next button, and we update page array (parr) by 1,
    // Step 1: make tempArr and then run a loop upto parr.length + 1, because if parr.length is 1, then loop will be running till 2, and in 
    //         tempArr two values will be coming i.e 1,2
    // Step 2: Now that we have the update array in the tempArr, so now update it in the parr Array using setState() function
    // Step 3: Always remember to use the spread operator like parr: [...tempArr] so the changes will be properly updated.
    // Step 4: Finally, executed the changeMovies function definition so that the function will execute after the parr is updated first.
    handleRight = () => {
        let tempArr = [];
        for(let i = 1; i <= this.state.parr.length + 1; i++){
            tempArr.push(i);
        }
        this.setState({
            parr: [...tempArr],
            currPage: this.state.currPage+1
        }, this.changeMovies); // Note, we did not added () bracket, because we do not want to make function call, instead we gave the function definition
        // We commented below line and added it to setState second argument, because
        // when we were updating state in setState, the javascript synchronously called below line 
        // and made a call to changeMovies, so because of that currPar value was not shhowing correctly.
        // Solution: solution to it is to pass the function as a second argument itself in the setState.
        // this.changeMovies();
    }

    // This function definition is executed when we click on the previous button, and we set currPage by currPage - 1 and then call changeMovies
    handleLeft = () => {
        if(this.state.currPage != 1){
            this.setState({
                currPage: this.state.currPage-1
            }, this.changeMovies);
        }
    }

    // This function definition is executed when we click on the page number which are already present, like 1,2,3,etc.
    handleClick = (value) => {
        // If our currPage and the page value which we clicked are not same, then only re render the page, by updating the currPage
        if(value != this.state.currPage){
            this.setState({
                currPage: value
            }, this.changeMovies);
        }
    }

    // It is used to store in the localStorage.
    handleFavourites = (movie) => {
        // Below line means to get the array from JSON.parse, in which we use localStorage getItem method and give string as 'movies', and if not present then return empty arr.
        let oldData =  JSON.parse(localStorage.getItem('movies-app') || "[]");
        if(this.state.favourites.includes(movie.id)){
           oldData = oldData.filter((m)=>m.id!=movie.id);
        }else{
           oldData.push(movie);
        }
        localStorage.setItem("movies-app", JSON.stringify(oldData));
        console.log(oldData);
        this.handleFavouritesState();
    }

    // This function is used to update the states also, if the localStorage is updated.
    handleFavouritesState = () => {
        let oldData = JSON.parse(localStorage.getItem('movies-app') || "[]");
        let temp = oldData.map((movie)=>movie.id);
        this.setState({
            favourites: [...temp]
        })
        
    }

  render() {
    // let movie = movies.results;
    // console.log('render');
    return (
      <>
      {
            this.state.movies.length === 0
            ?
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden"></span>
                </div>
            :
            <div>
                <h3 className="text-center"><strong>Trending</strong></h3>

                <div className='movies-list'>
                    {
                        this.state.movies.map((movieObj) => (
                            <div className="card movies-card" onMouseEnter={()=>this.setState({hover:movieObj.id})} onMouseLeave={()=>{this.setState({hover:''})}}>
                                <img className="card-img-top movies-img" src={`https://image.tmdb.org/t/p/original${movieObj.backdrop_path}`} alt={movieObj.title} />
                                {/* <div className="card-body"> */}
                                <h5 className="card-title movies-title">{movieObj.original_title}</h5>
                                {/* <p className="card-text movies-text">{movieObj.overview}</p> */}
                                <div className="button-wrapper" style={{display:'flex', width:'100%', justifyContent:'center'}}>
                                
                                {
                                    this.state.hover === movieObj.id && 
                                    <a className="btn btn-primary movies-button" onClick={() => this.handleFavourites(movieObj)}>{this.state.favourites.includes(movieObj.id) ? "Remove from favourites" : "Add to favourites"}</a>

                                }
                                
                                </div>
                                {/* </div> */}
                            </div>
                        ))
                    }
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item"><a class="page-link" onClick={this.handleLeft}>Previous</a></li>
                            {
                                this.state.parr.map((value)=>(
                                    <li class="page-item"><a class="page-link" onClick={()=>this.handleClick(value)}>{value}</a></li>

                                ))
                            }
                            <li class="page-item"><a class="page-link" onClick={this.handleRight}>Next</a></li>

                        </ul>
                    </nav>        
                </div>
            </div>
      }

      </>
    )
  }
}
