import { Injectable } from '@angular/core';
import { Booking } from '../../booking/shared/booking.model';
import * as moment from 'moment';

@Injectable()
export class HelperService{

    private getRangeOfDate (startAt, endAt, dateFormat ) {
        const tempDates = [];
        const mEndAt =  moment(endAt);
        let mStartAt = moment(startAt);

        while(mStartAt < mEndAt) {
            tempDates.push(mStartAt.format(Booking.DATE_FORMAT));
            mStartAt = mStartAt.add(1, 'day');
        }

        tempDates.push(moment(startAt).format(Booking.DATE_FORMAT));
        tempDates.push(mEndAt.format(Booking.DATE_FORMAT));
        return tempDates;
    }

    private formatDate(date, dateFormat) {
        return moment(date).format(dateFormat);
    }

    public formatBookingDate(date) {
        return this.formatDate(date, Booking.DATE_FORMAT);
    }

    public getBookingRangeOfDate(startAt, endAt) {
        return this.getRangeOfDate(startAt, endAt, Booking.DATE_FORMAT);
    }
}