/*!
 * FileInput Vietnamese Translations
 *
 * This file must be loaded after 'fileinput.js'. Patterns in braces '{}', or
 * any HTML markup tags in the messages must not be converted or translated.
 *
 * @see http://github.com/kartik-v/bootstrap-fileinput
 *
 * NOTE: this file must be saved in UTF-8 encoding.
 */

    $.fn.fileinputLocales['vn'] = {
        fileSingle: 'tập tin',
        filePlural: 'các tập tin',
        browseLabel: 'Duyệt &hellip;',
        captureLabel: 'Chụp',
        fileURLLabel: 'Đường dẫn',
        removeLabel: 'Gỡ bỏ',
        removeTitle: 'Bỏ tập tin đã chọn',
        cancelLabel: 'Hủy',
        cancelTitle: 'Hủy tải lên',
        uploadLabel: 'Tải lên',
        uploadTitle: 'Tải lên tập tin đã chọn',
        msgNo: 'Không',
        msgNoFilesSelected: 'Không tập tin nào được chọn',
        msgCancelled: 'Đã hủy',
        msgPlaceholder: 'Chọn {files}...',
        msgZoomModalHeading: 'Chi tiết xem trước',
        msgFileRequired: 'Bạn phải chọn một tệp để tải lên.',
        msgSizeTooSmall: 'Tệp "{name}" (<b>{size} KB</b>) quá nhỏ và phải lớn hơn <b>{minSize} KB</b>.',
        msgSizeTooLarge: 'Tập tin "{name}" (<b>{size} KB</b>) vượt quá kích thước giới hạn cho phép <b>{maxSize} KB</b>.',
        msgFilesTooLess: 'Bạn phải chọn ít nhất <b>{n}</b> {files} để upload.',
        msgFilesTooMany: 'Số lượng tập tin tải lên <b>({n})</b> vượt quá giới hạn cho phép là <b>{m}</b>.',
        msgFileNotFound: 'Không tìm thấy tập tin "{name}"!',
        msgFileSecured: 'Các hạn chế về bảo mật không cho phép đọc tập tin "{name}".',
        msgFileNotReadable: 'Không đọc được tập tin "{name}".',
        msgFilePreviewAborted: 'Đã dừng xem trước tập tin "{name}".',
        msgFilePreviewError: 'Đã xảy ra lỗi khi đọc tập tin "{name}".',
        msgInvalidFileName: 'Ký tự không hợp lệ hoặc không được hỗ trợ trong tên tệp "{name}".',
        msgInvalidFileType: 'Tập tin "{name}" không hợp lệ. Chỉ hỗ trợ loại tập tin "{types}".',
        msgInvalidFileExtension: 'Phần mở rộng của tập tin "{name}" không hợp lệ. Chỉ hỗ trợ phần mở rộng "{extensions}".',
        msgFileTypes: {
            'image': 'image',
            'html': 'HTML',
            'text': 'text',
            'video': 'video',
            'audio': 'audio',
            'flash': 'flash',
            'pdf': 'PDF',
            'object': 'object'
        },
        msgUploadAborted: 'Đã dừng tải lên',
        msgUploadThreshold: 'Đang xử lý...',
        msgUploadBegin: 'Đang khởi tạo...',
        msgUploadEnd: 'Đã xong',
        msgUploadEmpty: 'Không có dữ liệu hợp lệ để tải lên.',
        msgUploadError: 'Lỗi',
        msgValidationError: 'Lỗi xác nhận',
        msgLoading: 'Đang nạp {index} tập tin trong số {files} &hellip;',
        msgProgress: 'Đang nạp {index} tập tin trong số {files} - {name} - {percent}% hoàn thành.',
        msgSelected: '{n} {files} được chọn',
        msgFoldersNotAllowed: 'Chỉ kéo thả tập tin! Đã bỏ qua {n} thư mục.',
        msgImageWidthSmall: 'Chiều rộng của hình ảnh "{name}" phải tối thiểu là {size} px.',
        msgImageHeightSmall: 'Chiều cao của hình ảnh "{name}" phải tối thiểu là {size} px.',
        msgImageWidthLarge: 'Chiều rộng của hình ảnh "{name}" không được quá {size} px.',
        msgImageHeightLarge: 'Chiều cao của hình ảnh "{name}" không được quá {size} px.',
        msgImageResizeError: 'Không lấy được kích thước của hình ảnh để thay đổi kích cỡ.',
        msgImageResizeException: 'Thay đổi kích cỡ hình ảnh bị lỗi.<pre>{errors}</pre>',
        msgAjaxError: 'Đã xảy ra sự cố với thao tác {operation}. Vui lòng thử lại sau!',
        msgAjaxProgressError: 'Lỗi {operation}',
        ajaxOperations: {
            deleteThumb: 'Xóa tệp tin',
            uploadThumb: 'Tải lên',
            uploadBatch: 'Tả lên nhiều tệp',
            uploadExtra: 'Mẫu dữ liệu tải lên'
        },
        dropZoneTitle: 'Kéo thả tập tin vào đây &hellip;',
        dropZoneClickTitle: '<br>(hoặc click để chọn {files})',
        fileActionSettings: {
            removeTitle: 'Gỡ bỏ',
            uploadTitle: 'Tải lên',
            uploadRetryTitle: 'Tải lên lại',
            downloadTitle: 'Tải xuống',
            zoomTitle: 'Phóng lớn',
            dragTitle: 'Di chuyển / Sắp xếp lại',
            indicatorNewTitle: 'Chưa được tải lên',
            indicatorSuccessTitle: 'Đã tải lên',
            indicatorErrorTitle: 'Tải lên bị lỗi',
            indicatorLoadingTitle: 'Đang tải lên ...'
        },
        previewZoomButtonTitles: {
            prev: 'Xem tập tin phía trước',
            next: 'Xem tập tin tiếp theo',
            toggleheader: 'Ẩn/hiện tiêu đề',
            fullscreen: 'Bật/tắt toàn màn hình',
            borderless: 'Bật/tắt chế độ không viền',
            close: 'Đóng'
        }
    };
