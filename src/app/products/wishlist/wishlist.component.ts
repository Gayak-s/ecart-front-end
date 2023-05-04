import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  allproducts:any

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.getwishlist().subscribe(
      //200 response
      (result:any)=>{
      console.log(result);
      this.allproducts = result
    },
    ///400 response
    (result:any)=>{
      alert(result.error)
    }
    )

  }

  //remove wishlist item
  removeitem(id:any){
    this.api.removewishlistitem(id).subscribe(
      //200
      (result:any)=>{
        this.allproducts = result
      },
      //400
      (result:any)=>{
        alert(result.error)
      }
    )
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
        //then remove item from wishlist
        this.removeitem(product.id)
        alert(result)
      },
      //400
      (result:any)=>{
        alert(result.error)
      }
    )
    
    
  }

}
