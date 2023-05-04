import { Component, OnInit } from '@angular/core';
import { ApiService } from '../products/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  cartCount:any

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.api.cartItemsCount.subscribe((data:any)=>{
      this.cartCount = data
      
    })
  }

  search(event:any){
    // event.targer.value is the value of search input box
    // console.log(event.target.value);
    this.api.searchTerm.next(event.target.value)
  }
}
