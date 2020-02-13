import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Booking } from '../../../booking/shared/booking.model';
import { Rental } from '../../shared/rental.model';
import { HelperService } from '../../../common/service/helper.service';
import { BookingService } from '../../../booking/shared/booking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import * as moment from 'moment';
import { AuthService } from '../../../auth/shared/auth.service'

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})

export class RentalDetailBookingComponent implements OnInit {
  @Input() rental: Rental;

  @ViewChild(DaterangePickerComponent, null)
    private picker: DaterangePickerComponent;

  @ViewChild('bookingNoteTitle', null)
    private somePTag: ElementRef;

  newBooking: Booking;
  modalRef: any;

  daterange: any = {};
  bookedOutDates: any[] = [];
  errors: any[] = [];

  options: any = {
    locale: { format: Booking.DATE_FORMAT },
    alwaysShowCalendars: false,
    opens: 'left',
    autoUpdateInput: false,
    isInvalidDate: this.checkForInvalidDates.bind(this)
  };


  constructor(private helper: HelperService,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private toastr: ToastrService,
    public auth: AuthService) { 
  }

  ngOnInit() {
   this.newBooking = new Booking();
   this.getBookedOutDates();

   this.somePTag.nativeElement.style.color = "red";
  }

  private checkForInvalidDates(date) {
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

  private resetDatepicker(){
    this.picker.datePicker.setStartDate(moment());
    this.picker.datePicker.setEndDate(moment());
    this.picker.datePicker.element.val('');
  }

  openConfirmModal(content){
    this.errors = [];
    this.modalRef = this.modalService.open(content);
  }

  private addNewBookedDates(bookingData: any){
    //after confirming booking add the new dates to the calendar so they are blocked out
    const dateRange = this.helper.getBookingRangeOfDate(bookingData.startAt, bookingData.endAt);
    this.bookedOutDates.push(...dateRange);
  }
  
  onPaymentConfirmed(paymentToken: any) {
   this.newBooking.paymentToken = paymentToken;
  //  console.log('payment token');
  //  console.log(this.newBooking.paymentToken);
  }

  createBooking(){
    this.newBooking.rental = this.rental;

    this.bookingService.createBooking(this.newBooking).subscribe(
      (bookingData: any) => {
        this.addNewBookedDates(bookingData);
        this.newBooking = new Booking();
        this.modalRef.close();
        this.resetDatepicker();
        this.toastr.success('Booking has been succesfuly created, check your booking detail in manage section', 'Booking successful');
       },
      (errorResponse) =>{
        this.errors = errorResponse.error.errors;
      }
    )
  }

  selectedDate(value: any, datepicker?: any) {
    this.options.autoUpdateInput = true;
    this.newBooking.startAt = this.helper.formatBookingDate(value.start);
    this.newBooking.endAt = this.helper.formatBookingDate(value.end);
    this.newBooking.days = -(value.start.diff(value.end, 'days'));
    this.newBooking.totalPrice = this.newBooking.days * this.rental.dailyRate;
  }

}
