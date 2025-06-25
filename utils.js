class ApiFeature {
  constructor(model, reqQuery) {
    this.model = model;
    this.reqQuery = reqQuery;
  }

  filter() {
    let queryCopy = { ...this.reqQuery };

    const excludeFields = ['fields', 'page', 'limit', 'sort'];
    excludeFields.forEach((item) => delete queryCopy[item]);

    // advanced filtering
    let queryString = JSON.stringify(queryCopy);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    console.log(queryString);
    this.model = this.model.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.model = this.model.sort(sortBy);
    } else {
      this.model = this.model.sort('-createdAt');
    }

    return this;
  }

  fields() {
    if (this.reqQuery.fields) {
      const selectOnly = this.reqQuery.fields.split(',').join(' ');
      this.model = this.model.select(selectOnly);
    } else {
      this.model = this.model.select('-__v');
    }
    return this;
  }

  limit() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 20;
    const skip = (page - 1) * limit;

    console.log(page, limit, skip);

    this.model = this.model.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeature;
