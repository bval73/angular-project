import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from './review.model'
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReviewService{
  constructor (private http: HttpClient){}

  public createReview(review: Review, bookingId: string): Observable<any>{
    debugger;
    return this.http.post(`/api/v1/reviews?bookingId=${bookingId}`, review);
  }

  public getRentalReviews(rentalId: number): Observable<any> {
    return this.http.get(`/api/v1/reviews?rentalId=${rentalId}`);
  }

  public getOverallRating(rentalId: number): Observable<any> {
    return this.http.get(`/api/v1/reviews/$(rentalId)/rating`);
  }


}
