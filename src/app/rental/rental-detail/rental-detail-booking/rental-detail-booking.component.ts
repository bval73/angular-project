import { Component, OnInit, Input } from '@angular/core';
import { Booking } from '../../../booking/shared/booking.model';
import { Rental } from '../../shared/rental.model';
import { HelperService } from '../../../common/service/helper.service';
import { BookingService } from '../../../booking/shared/booking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {
  @Input() rental: Rental;

  newBooking: Booking;
  modalRef: any;

  daterange: any = {};
  bookedOutDates: any[] = [];

  options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: 'left',
    isInvalidDate: this.checkForInvalidDate.bind(this)
  };


  constructor(private helper: HelperService,
    private modalService: NgbModal,
    private bookingService: BookingService) { }

  ngOnInit() {
   this.newBooking = new Booking();
    this.getBookedOutDates();
  }

  private checkForInvalidDate(date) {
    return this.bookedOutDates.includes(this.helper.formatBookingDate(date)) || date.diff(moment(), 'days') < 0;

  }

  private getBookedOutDates(){
    const bookings: Booking[] = this.rental.bookings;

    if(bookings && bookings.length > 0){
      bookings.forEach((booking: Booking) => {
        const dateRange = this.helper.getBookingRangeOfDate(booking.startAt, booking.endAt)
        this.bookedOutDates.push(...dateRange);
      });
    }
  }

  openConfirmModal(content){
    this.modalRef = this.modalService.open(content);
  }
  

  createBooking(){
    this.newBooking.rental = this.rental;

    this.bookingService.createBooking(this.newBooking).subscribe(
      (bookingData) => {
        this.newBooking = new Booking();
        this.modalRef.close();
      },
      () =>{}
    )
  }

  selectedDate(value: any, datepicker?: any) {
    this.newBooking.startAt = this.helper.formatBookingDate(value.start);
    this.newBooking.endAt = this.helper.formatBookingDate(value.end);
    this.newBooking.days = -(value.start.diff(value.end, 'days'));
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
  }

}
