let inpName =  document.querySelector("#inpName");
let inpImage =  document.querySelector("#inpImg");
let inpJanr =  document.querySelector("#inpJanr");
let inpDesc =  document.querySelector("#inpDesc");
let inpYear =  document.querySelector("#inpYear"); 
const API = "http://localhost:8010/movie";
let form = document.querySelector("form");
let movieCards = document.querySelector("#movies");
let detailsModal = document.querySelector("#showModal");
let closeBtnDetailsModal = document.querySelector("#closeBtn");
let detailsImage = document.querySelector("#detailModalImg");
let detailsName = document.querySelector("#detailmodal-r h2");
let detailsDesc = document.querySelector("#detailmodal-r p");
let detailsYear = document.querySelector("#detailmodal-r h1")
let detailsGenre = document.querySelector("#detailmodal-r h3");
let inpSearch = document.querySelector(".search");
let prevBtn = document.querySelector("#btn-prev");
let nextBtn = document.querySelector("#btn-next");
let currentPage = 1;
let pageLength = 1;
let filtersBtn = document.querySelectorAll(".filter_btns button");
let filterValue = "All";





form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if (
        !inpName.value.trim() ||
        !inpImage.value.trim() ||
        !inpJanr.value.trim() ||
        !inpDesc.value.trim() ||
        !inpYear.value.trim() 
      ) {
        alert("Заполните все поля!");
        return;
      }
      let newList = {
    name: inpName.value,
    image: inpImage.value,
    year: inpYear.value,
    description: inpDesc.value,
    genre: inpJanr.value,
      }
      createMovieList(newList)
})

// ! ------------------Create------------------
async function createMovieList(objList){
await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objList),
});
readMovieList()
let inputs = document.querySelectorAll("form input");
    inputs.forEach((elem)=>{
        elem.value = "";
        // console.log(elem);
    })
}
// createMovieList()


// !-------------------Read---------------------

async function readMovieList(search = ""){
    let res = 
    filterValue !== "All"
      ? await fetch(
          `${API}?q=${search}&_page=${currentPage}&_limit=10&category=${filterValue}`
        )
      : await fetch(`${API}?q=${search}&_page=${currentPage}&_limit=10`);
    let data = await res.json();
    console.log(data);
    movieCards.innerHTML = "";
    data.forEach((elem)=>{
        movieCards.innerHTML += `
        <div class="movie-f">
          <img
            class="poster" 
            src="${elem.image}"
            alt="${elem.name}"
            onclick="showDetailsModal(${elem.id})"
          />
          <h2>${elem.name}</h2>
          <h5>${elem.year}</h5>
          <div class = "btn"> <button onclick="deleteMovieList(${elem.id})">delete</button>
          <button onclick="showModalEdit(${elem.id})">edit</button>
          </div>
        </div>
        `;
    });
    countPages();
}
readMovieList();

// !---------delete------
async function deleteMovieList(id){
    await fetch(`${API}/${id}`,{
    method:"DELETE",
    });
    readMovieList();
};

// !--------------------Edit--------------
let modal = document.querySelector("#modal");
let closeBtn = document.querySelector("#closeEditModal");
let editInpName = document.querySelector("#editInpName");
let editInpImage = document.querySelector("#editInpImage");
let editInpYear = document.querySelector("#editInpYear");
let editInpDesc = document.querySelector("#editInpDesc");
let editInpGenre = document.querySelector("#editInpGenre");
let editForm = document.querySelector("#editForm");
let btnSave = document.querySelector(".save");

async function showModalEdit(id){
    modal.style.display = "flex";
    let res = await fetch(`${API}/${id}`);
    let data = await res.json();
//     console.log(data);
editInpName.value = data.name;
  editInpImage.value = data.image;
  editInpYear.value = data.year;
  editInpDesc.value = data.description;
  editInpGenre.value = data.genre;
  btnSave.setAttribute("id", data.id);
}
editForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let editList = {
    name: editInpName.value,
    image: editInpImage.value,
    year: editInpYear.value,
    description: editInpDesc.value,
    genre: editInpGenre.value,
    };
    console.log(btnSave.id)
    editListFunc(editList, btnSave.id)
    
})
async function editListFunc(editList, id){
    let res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(editList),
    });
    modal.style.display = "none";
    readMovieList();
}

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    
  });

//   ! Details 

async function showDetailsModal(id){
detailsModal.style.display = "flex";
let res = await fetch (`${API}/${id}`);
let data = await res.json();
console.log(data);
detailsImage.src=data.image;
detailsName.innerText=data.name;
detailsDesc.innerText=data.description;
detailsYear.innerText=data.year;
detailsGenre.innerText = data.genre;
console.log(detailsImage.src);
}
closeBtnDetailsModal.addEventListener("click", ()=>{
  detailsModal.style.display = "none";
})

// !--------Search-----------------
inpSearch.addEventListener("input", (e)=>{
  readMovieList(e.target.value);
})
// !----------pagination------------
async function countPages(){
  let res = await fetch(API);
  let data = res.json();
pageLength = Math.ceil(data.length / 10)
}
prevBtn.addEventListener("click", ()=>{
  if (currentPage <= 1){return} 
  currentPage--;
  readMovieList()
});
nextBtn.addEventListener("click", ()=>{
  if (currentPage >= pageLength) {return}
  currentPage++;
  readMovieList()
});

// !------------filter------------
console.log(filtersBtn)
filtersBtn.forEach((elem)=>{

  elem.addEventListener("click", ()=>{
    // console.log(elem.innerText);
    filterValue = elem.innerText;
    console.log(filterValue);

    readMovieList();
  })
})
