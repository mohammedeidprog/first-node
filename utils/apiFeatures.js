class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const filterQuery = { ...this.queryString };
    const excludedFields = ["limit", "page", "sort", "fields", "keyword"];
    excludedFields.forEach((element) => delete filterQuery[element]);
    // apply filtering (gt | gte | lt | lte)
    let querySTR = JSON.stringify(filterQuery);
    querySTR = querySTR.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querySTR));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // console.log(this.queryString.sort.split(",").join(" "));
      const sortQuery = this.queryString.sort.replace(",", " ");
      this.mongooseQuery = this.mongooseQuery.sort(sortQuery);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const query = {};
      query.$or = [
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { description: { $regex: this.queryString.keyword, $options: "i" } },
        { name: { $regex: this.queryString.keyword, $options: "i" } },
      ];

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(documentsNumber) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.totalPages = Math.ceil(documentsNumber / limit);

    if (skip > 0) {
      pagination.previousPage = page - 1;
    }
    if (page * limit < documentsNumber) {
      pagination.nextPage = page + 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.pagination = pagination;

    return this;
  }
}

module.exports = ApiFeatures;
