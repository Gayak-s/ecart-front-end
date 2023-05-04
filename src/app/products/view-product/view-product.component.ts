import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  productId:any
  product:any

  //activated route is used to get path paramenter 
  constructor(private viewActivatedRoute:ActivatedRoute , private api:ApiService){}


  ngOnInit(): void {
    //to get path paramenter 
    this.viewActivatedRoute.params.subscribe((result:any)=>{
      console.log(result.id);
      this.productId = result.id
    })

    //api call for view product
    this.api.viewproduct(this.productId).subscribe((result:any)=>{
      console.log(result);
      this.product = result
    },
    (result:any)=>{
      console.log(result.error);
    }
    )
  }

  //api to add to wishlist
  addtowishlist(){
    const {id,title,price,image} = this.product
    this.api.addtowishlist(id,title,price,image).subscribe(
      //200 response
      (result:any) =>{
        alert(result)
      },
      //400 response
      (result:any) =>{
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
        alert(result)
      },
      //400
      (result:any)=>{
        alert(result.error)
      }
    )
    
    
  }
}

