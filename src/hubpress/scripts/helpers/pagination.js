// ### Pagination Helper
// `{{pagination}}`
// Outputs previous and next buttons, along with info about the current page

var _               = require('lodash'),
    template        = require('./template'),
    pagination;

function logAndThrowError(err) {
  console.log(err);
  throw new Error(err);
}


pagination = function (options) {
    /*jshint unused:false*/
    if (!_.isObject(this.pagination) || _.isFunction(this.pagination)) {
        return logAndThrowError('pagination data is not an object or is a function');
    }

    if (_.isUndefined(this.pagination.page) || _.isUndefined(this.pagination.pages) ||
        _.isUndefined(this.pagination.total) || _.isUndefined(this.pagination.limit)) {
        return logAndThrowError('All values must be defined for page, pages, limit and total');
    }

    if ((!_.isNull(this.pagination.next) && !_.isNumber(this.pagination.next)) ||
        (!_.isNull(this.pagination.prev) && !_.isNumber(this.pagination.prev))) {
        return logAndThrowError('Invalid value, Next/Prev must be a number');
    }

    if (!_.isNumber(this.pagination.page) || !_.isNumber(this.pagination.pages) ||
        !_.isNumber(this.pagination.total) || !_.isNumber(this.pagination.limit)) {
        return logAndThrowError('Invalid value, check page, pages, limit and total are numbers');
    }

    var context = _.merge({}, this.pagination);

    if (this.tag !== undefined) {
        context.tagSlug = this.tag.slug;
    }

    if (this.author !== undefined) {
        context.authorSlug = this.author.slug;
    }

    return template.execute('pagination', context);
};

module.exports = pagination;
