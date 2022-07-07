export class PaginationList {
  constructor() {
    this.content = [];
    this.empty = false;
    this.first = false;
    this.last = false;
    this.number = 0;
    this.numberOfElements = 0;
    this.size = 20;
    this.sort = {
      empty: false,
      sorted: false,
      unsorted: false,
    };
    this.totalElements = 0;
    this.totalPages = 0;
  }
}