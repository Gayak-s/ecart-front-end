import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;

  

  allCartItems:any=[]
  CartTotalPrice:number=0
  proceedToBtnStatus:boolean=false
  offerClickedStatus:boolean=false
  username:any
  flat:any
  street:any
  state:any
  discountClickStatus:boolean=false
  showpaypal:boolean=false
  showSuccess:boolean=false
  showCancel:boolean=false
  showError:boolean=false

  //reactive form -modal form
  addressFrom = this.fb.group({
    username:['',[Validators.required]],
    flat:['',[Validators.required]],
    street:['',[Validators.required]],
    state:['',[Validators.required]]
  })

  constructor(private api:ApiService,private fb:FormBuilder ){}


  ngOnInit(): void {
   
    this.api.getCart().subscribe(
      //200
      (result:any)=>{
        this.allCartItems = result
        //to get cart total
        this.cartTotal()
        // paypal function
        this.initConfig()
      },
      //400
      (result:any)=>{
        console.log(result.error);
      }
    )

    // paypal function
    this.initConfig()
  }

  removeitem(id:any){
    this.api.removecart(id).subscribe(
      //200
      (result:any)=>{
        console.log(result);
        alert('Item Removed From Your Cart')
        this.api.cartCount()
        this.allCartItems = result
        //call cart total to update cart total when a item is removed
        this.cartTotal()
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  // to find cart total
  cartTotal(){
    let total=0
    this.allCartItems.forEach((item:any) => {
      total += item.grantTotal
      // Math.ceil() is to round the decimel points
      this.CartTotalPrice = Math.ceil(total)
    });

  }


  //empty cart
  emptyCart(){
    this.api.emptyCart().subscribe(
    (result:any)=>{
      // alert(result)
      this.allCartItems=[]
      // update count
      this.api.cartCount()
      // update CartTotalPrice
      this.cartTotal()
    },
    (result)=>{
      alert(result.error)
    }
    )
  }

  //increment quantity
  increment(id:any){
    this.api.incCartItem(id).subscribe(
      //200
      (result:any)=>{
        this.allCartItems = result
        // update total
        this.cartTotal()
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  // // decrement quantity
  decrement(id:any){
    this.api.decCartItem(id).subscribe(
      // 200
      (result:any)=>{
        this.allCartItems=result
        // update total
        this.cartTotal()
      },
      (result:any)=>{
        alert(result.error)
      }
    )
  }

  delivery(){
    if (this.addressFrom.valid) {
       this.username = this.addressFrom.value.username
       this.flat = this.addressFrom.value.flat
       this.street = this.addressFrom.value.street
       this.state = this.addressFrom.value.state
      this.proceedToBtnStatus = true
    }
    else{
      alert('invalid form')
    }
  }

  offerclicked(){
    this.offerClickedStatus=true
  }


  discount50(){
    let discount= Math.ceil(this.CartTotalPrice*50/100)
    this.CartTotalPrice -= discount
    this.discountClickStatus=true
  }

  discount10(){
    let discount = Math.ceil(this.CartTotalPrice*10/100)
    this.CartTotalPrice -= discount
    this.discountClickStatus=true
  }

  modalclose(){
    this.addressFrom.reset()
    this.showCancel=false
    this.showError=false
    this.showSuccess=false
    // to hide delivery address
    this.proceedToBtnStatus=false
    this.showpaypal=false
  }

  makepayment(){
    this.showpaypal=true
  }

  // paypal payment method
  private initConfig(): void {
    let amount = this.CartTotalPrice.toString()
    this.payPalConfig = {
    currency: 'USD',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: amount
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: amount,
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
      // epmty the cart
      this.emptyCart()
      // hide paypal view
      this.showpaypal=false
      // hide proceed to buy buttonb   
      this.proceedToBtnStatus=false
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
      this.showCancel=true
      // hide paypal view
      this.showpaypal=false
    },
    onError: err => {
      console.log('OnError', err);
      this.showError=true
      // hide paypal view
      this.showpaypal=false
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

 
}




