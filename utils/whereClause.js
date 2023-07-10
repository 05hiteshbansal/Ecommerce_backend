//base is  product.find() to find it 

//big Quere it is the big url that we get 

class WhereClause{
    constructor(base,bigQuerry){
        this.base=base;
        this.bigQuerry=bigQuerry
    }

// search 

search(){
    const searchWord = this.bigQuerry.search ? {
        name :{
            // regecs

            $regex : this.bigQuerry.search,
            $option : 'i'
        }
    }:{}

    this.base = this.base.find({...searchWord})
    return this;
}



// filtering product


filter(){
const copyQ = {...this.bigQuerry};
delete copyQ['search']
delete copyQ['limit']
delete copyQ['page']

// convert queue in a string

let stringofCopyQ= JSON.stringify(copyQ)
stringofCopyQ=stringofCopyQ.replace(/\b(gte|lte|gt|lt)\b/g,m=> `$${m}` )

const jsonofcopyq=JSON.parse(stringofCopyQ)

this.base = this.base.find(jsonofcopyq)
return this
}
// pagination

pager(resultperPage){
    let currentPage = 1;
    if(this.bigQuerry.page){
        currentPage  = this.bigQuerry.page
    }

    // limit is no to show
   this.base =  this.base.limit(resultperPage).skip(resultperPage*(currentPage-1))
   //console.log(this)
   return this
}



// rating 



}


module.exports=WhereClause