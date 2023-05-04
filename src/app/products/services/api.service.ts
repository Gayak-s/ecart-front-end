import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //to hold searchterm from header component
  searchTerm = new BehaviorSubject('')
  //to hold cart all products count
  cartItemsCount = new BehaviorSubject(0)
  

  BASE_URL = 'https://ecart-hzt2.onrender.com'




  constructor(private http:HttpClient) {
    //cartCount function call 
    this.cartCount()
   }


  //  --------products


  //get all products
  getallproducts(){
    return this.http.get(`${this.BASE_URL}/products/all-products`)
  }

  //view product
  viewproduct(id:any){
    return this.http.get(`${this.BASE_URL}/products/view-product/${id}`)
  }


          //-------- wishlist

  //add to wishlist
  addtowishlist(id:any,title:any,price:any,image:any){
    //create body to post method
    const body = {
      id,
      title,
      price,
      image
    }
    return this.http.post(`${this.BASE_URL}/wishlist/add-product`,body)
  }

  //get all products from wishlist
  getwishlist(){
    return this.http.get(`${this.BASE_URL}/wishlist/view-products`)
  }

  //remove item from wishlist
  removewishlistitem(id:any){
    return this.http.delete(`${this.BASE_URL}/wishlist/remove-item/${id}`)
  }


            //cart
  
  //add to cart
  addtocart(product:any){
    // get product details from product
    const body = {
      id:product.id,
      title:product.title,
      image:product.image,
      price:product.price,
      quantity:product.quantity
    }

    return this.http.post(`${this.BASE_URL}/cart/add-product`,body)

  }

  // get cart - /cart/get-all-product
  getCart(){
    return this.http.get(`${this.BASE_URL}/cart/get-all-product`)
  }

  //cart count
  cartCount(){
    this.getCart().subscribe((result:any)=>{
      this.cartItemsCount.next(result.length)
    })
  }


  //remove cart itme - /cart/remove-item
  removecart(id:any){
    return this.http.delete(`${this.BASE_URL}/cart/remove-item/${id}`)
  }

  // empty cart
  emptyCart(){
    return this.http.delete(`${this.BASE_URL}/cart/remove-all`)
  }

  // increment cart item cart/item-increment/
  incCartItem(id:any){
    return this.http.get(`${this.BASE_URL}/cart/item-increment/${id}`)
  }

  // decrement cart item cart/item-decrement/
  decCartItem(id:any){
    return this.http.get(`${this.BASE_URL}/cart/item-decrement/${id}`)
  }
}
