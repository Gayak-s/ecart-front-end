import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{

  allproducts:any
  searchTerm:string=''

  constructor(private api:ApiService){}

  ngOnInit(): void {
   this.api.getallproducts().subscribe((result:any)=>{
    console.log(result);
    this.allproducts = result
   })

  //  to get search term from api services
   this.api.searchTerm.subscribe((result:any)=>{
    this.searchTerm = result
    console.log(this.searchTerm);
    
   })

  }

  //add to cart
  addtocart(product:any){
    
    //add {quantity:1} to product object
    Object.assign(product,{quantity:1})
    // product.quantity=1   || prodcut['quantity'] = 1
    console.log(product);

    this.api.addtocart(product).subscribe(
      //200
      (result:any)=>{
        //increment cart count from apiservice cartcount()
        this.api.cartCount()
        alert(result)
      },
      //400
      (result:any)=>{
        alert(result.error)
      }
    )
    
    
  }
}
