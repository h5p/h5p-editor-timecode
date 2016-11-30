/**
 * @namespace H5PEditor
 */
H5PEditor.widgets.timecode = H5PEditor.Timecode = (function ($, NumberField) {

  /**
   * Converts timecodes to seconds.
   *
   * @class
   * @param {*} parent
   * @param {Object} field
   * @param {Number} params
   * @param {Function} setValue
   */
  function Timecode(parent, field, params, setValue) {
    var self = this;

    // Global elements
    var $item, $input, $errors;

    self.field = field;

    /**
     * Initialize timecode fields.
     *
     * @private
     */
    var init = function () {
      if (params !== undefined) {
        // Create timecode
        params = toTimecode(params);
      }

      $item = $(createHtml());
      $input = $item.find('input');
      $errors = $item.children('.h5p-errors');

      // Validate on change
      $input.change(function () {
        // Validate
        var value = self.validate();

        if (value !== false) {
          // Set param
          setValue(field, value);
        }
      });
    };

    /**
     * Create the HTML for the field.
     *
     * @private
     */
    var createHtml = function () {
      var input = H5PEditor.createText(params, 15);
      var label = H5PEditor.createLabel(field);
      return H5PEditor.createItem(field.type, label + input, field.description);
    };

    /**
     * Converts seconds to timecode.
     *
     * @private
     * @param {Number} seconds
     * @returns {String}
     */
    var toTimecode = function (seconds) {
      // H5P.Timer works with milliseconds
      var timecode = H5P.Timer.toTimecode(seconds * 1000);
      return timecode.substring(0, timecode.lastIndexOf('.'));
    };

    /**
     * Converts seconds to timecode.
     *
     * @private
     * @param {Number} seconds
     * @returns {String}
     */
    var toSeconds = function (timecode) {
      // H5P.Timer works with milliseconds
      var milliseconds = H5P.Timer.toMilliseconds(timecode);
      return Math.round(milliseconds / 1000);
    };

    /**
     * Append field to given wrapper.
     *
     * @public
     * @param {jquery} $wrapper
     */
    self.appendTo = function ($wrapper) {
      $item.appendTo($wrapper);
    };

    self.getDomElement = function () {
      return $item;
    };

    /**
     * Validate field.
     *
     * @return {*} valid value or false
     */
    self.validate = function () {
      // Retrieve timecode
      var value = H5P.trim($input.val());

      // Reset error messages
      $errors.html('');

      try {
        if (!value.length) {
          if (field.optional === true) {
            // Field is optional and does not have a value, nothing more to validate
            return;
          }

          // Field must have a value
          throw ct('requiredProperty', {':property': 'number field'});
        }
        else {
          // Convert timecode to seconds
          value = toSeconds(value);

          // Check that field doesn't exceed its min and max values.
          if (field.max !== undefined && value > field.max) {
            throw ct('exceedsMax', {':property': field.name, ':max': toTimecode(field.max)});
          }
          else if (field.min !== undefined && value < field.min) {
            throw ct('exceedsMin', {':property': field.name, ':min': toTimecode(field.min)});
          }
        }
      }
      catch (error) {
        $errors.append(H5PEditor.createError(error));
      }

      return H5PEditor.checkErrors($errors, $input, value);
    };

    /**
     * Remove field.
     *
     * @public
     */
    self.remove = function () {
      $item.remove();
    };

    init();
  }

  /**
   * Retrieve local translation.
   *
   * @private
   * @param {String} key
   * @param {Object} [placeholders]
   * @returns {String}
   */
  var t = function (key, placeholders) {
    return H5PEditor.t('H5PEditor.Timecode', key, placeholders);
  };

  /**
   * Retrieve core translation.
   *
   * @private
   * @param {String} key
   * @param {Object} [placeholders]
   * @returns {String}
   */
  var ct = function (key, placeholders) {
    return H5PEditor.t('core', key, placeholders);
  };

  // Default english translations
  H5PEditor.language['H5PEditor.Timecode'] = {
    libraryStrings: {
      invalidTime: '":property" contains an invalid timecode.'
    }
  };

  return Timecode;
})(H5P.jQuery, H5PEditor.Number);
