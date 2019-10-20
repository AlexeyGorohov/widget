import { writable } from 'svelte/store';

const seatingArr = [...Array(100).keys()].map(item => ({
    id: item,
    price: 120,
    disabled: false,
  }));

function seatingCreate() {
    const { subscribe, update } = writable(seatingArr);

    return {
        subscribe,
        toggleSeat: seatId => {
            update(seats => {
                seats[seatId].disabled = !seats[seatId].disabled;
                return seats;
            });
        }
    };
}

export const seating = seatingCreate();