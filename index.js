
const express=require('express');
const api=express();
api.use(express.json());

const PORT=3000;

//tests
let books=[{
    id: 1,
    title: "To Kill a Mockingbird",
    details: [
      {
        id: 1,
        author: "Harper Lee",
        genre: "Fiction",
        publicationYear: 1960
      }
    ]
  }
]

let whoami={studentNumber:'2663025'}


api.get('/whoami',(_,response)=>{
    response.json(whoami);
});


api.get('/books',(request,response)=>{
    response.json(books);
});


function findBookById(id){
    return books.find(book=>book.id===id);
}
api.get('/books/:id',(request,response)=>{
    const bookId=parseInt(request.params.id);
    const book=findBookById(bookId);
    if(!book){
        return response.status(404).json({message:"404 Not Found"});
    }
    response.json(book);
});


api.post('/books',(request,response)=>{
    let details=[];

    for (let i=0;i<books.length;++i){
        details.push({
            id:request.body.details[i].id ||books.length+1,
            author:request.body.details[i].author,
            genre:request.body.details[i].genre,
            publicationYear:request.body.details[i].publicationYear
        });
    }
   const newCollection={id:books.length+1,
    title:request.body.title,
    details:details};
    books.push(newCollection);
    response.status(201).json(newCollection);
});

api.put('/books/:id',(request,response)=>{
    const bookId=parseInt(findBookById(request.params.id));
    const book=findBookById(bookId);

    if (!book){
       return response.status(404).json({message:" 400 Bad Request"});
    }
    book.title=request.body.title ||book.title;
    book.details=request.body.details || book.details;
    response.status(200).json(book);

});

api.delete('/books/:id',(request,response)=>{
    const bookId=parseInt(findBookById(request.params.id));
    const book=findBookById(bookId);
    if (!book){
        return response.status(404).json({message:"Book not found"});
    }
    const index=books.findIndex(idx=>idx.id===bookId);
    books.splice(index,1);
    response.status(204).send();
});


api.post('/books/:id/details/',(request,response)=>{
    const bookId=parseInt(findBookById(request.params.id));
    const book=findBookById(bookId);

    if(!book){
        return response.status(404).json({message:"Book not found"});
    }
    newCollection={id:books.length+1,author:request.body.author,genre:request.body.genre,publicationYear:request.body.publicationYear};
    books.push(newCollection);
    response.status(201).json(newCollection);
});

api.delete('/books/:id/details/:detailId',(request,response)=>{
    const bookId=parseInt(request.params.id);
    const bookIndex=parseInt(request.params.detailId);
    const book=findBookById(bookId);
    if (!book){
        return response.status(404).json({message:"Book not found"});
    }
    if (bookIndex<0 ){
        return response.status(404).json({message:"Details not found"});
    }
    book.details.splice(bookIndex,1);
    response.status(204).send();


});





api.listen(PORT,()=>console.log("Server running boii"));