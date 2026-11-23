/* sd-document-builder — các plugin CKEditor của @sd-angular/core 19.0.10
   (fesm2022/sd-angular-core-components-document-builder.mjs, dòng 13–58 và 142–4415, NGUYÊN VĂN).
   Chỉ thay import: 'ckeditor5' → global SdCKEditor5 của kit; @sdcorejs/utils → shim tối thiểu (shims.js). */
import { Plugin, ButtonView, Widget, toWidget, ViewUpcastWriter, Matcher, ViewDocument, ViewDomConverter, ClipboardPipeline, ContextualBalloon } from './ck.js';
import { Utilities, ColorUtilities, BrowserUtilities, resolveMaybeAsync } from './shims.js';
class PageNumberPlugin extends Plugin {
    init() {
        const editor = this.editor;
        // i18n nằm trong editor.config — plugin không có DI nên đọc qua config; Angular wrapper luôn truyền _i18n
        const i18n = editor.config.get('_i18n');
        // 1. Đăng ký nút "Số trang hiện tại"
        editor.ui.componentFactory.add('pageNumber', locale => {
            const view = new ButtonView(locale);
            view.set({
                label: i18n?.t('core.component.document-builder.page-number.current') ?? '',
                icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H4V4h12v12zM6 6h2v2H6zm0 4h2v2H6zm0 4h2v2H6zm4-8h4v2h-4zm0 4h4v2h-4zm0 4h4v2h-4z"/></svg>', // Icon đơn giản
                tooltip: true
            });
            // Khi bấm nút -> Chèn HTML đánh dấu
            view.on('execute', () => {
                editor.model.change(writer => {
                    const viewFragment = editor.data.processor.toView(
                    // Đây là HTML chuẩn để Word hiểu là số trang (dùng cho cách xuất MHTML/.doc)
                    // Hoặc là marker để Backend replace
                    '<span class="page-number-marker" style="mso-field-code: PAGE; background: #eee; border: 1px dashed #999; padding: 0 4px;">[PAGE]</span> ');
                    const modelFragment = editor.data.toModel(viewFragment);
                    editor.model.insertContent(modelFragment);
                });
            });
            return view;
        });
        // 2. Đăng ký nút "Tổng số trang"
        editor.ui.componentFactory.add('totalPages', locale => {
            const view = new ButtonView(locale);
            view.set({
                label: i18n?.t('core.component.document-builder.page-number.total') ?? '',
                icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
                tooltip: true
            });
            view.on('execute', () => {
                editor.model.change(writer => {
                    const viewFragment = editor.data.processor.toView('<span class="total-page-marker" style="mso-field-code: NUMPAGES; background: #eee; border: 1px dashed #999; padding: 0 4px;">[TOTAL]</span> ');
                    const modelFragment = editor.data.toModel(viewFragment);
                    editor.model.insertContent(modelFragment);
                });
            });
            return view;
        });
    }
}

/**
 * Cấu hình màu cho Document Builder
 * Bảng màu tập trung và cấu hình cho việc lựa chọn màu nhất quán
 */
/**
 * Trả về bảng màu chung được sử dụng trong tất cả tính năng của document builder
 * @returns Mảng các tùy chọn màu được định sẵn với giá trị hex và label
 */
function getPresetColors() {
    return [
        { color: '#000000', label: 'Black' },
        { color: '#4D4D4D', label: 'Dim grey' },
        { color: '#999999', label: 'Grey' },
        { color: '#E6E6E6', label: 'Light grey' },
        { color: '#FFFFFF', label: 'White' },
        { color: '#E64D4D', label: 'Red' },
        { color: '#E6994D', label: 'Orange' },
        { color: '#E6E64D', label: 'Yellow' },
        { color: '#99E64D', label: 'Light green' },
        { color: '#4DE64D', label: 'Green' },
        { color: '#4DE699', label: 'Aquamarine' },
        { color: '#4DE6E6', label: 'Turquoise' },
        { color: '#4D99E6', label: 'Light blue' },
        { color: '#4D4DE6', label: 'Blue' },
        { color: '#994DE6', label: 'Purple' },
    ];
}
/**
 * Trả về cấu hình bộ chọn màu với định dạng hex
 * @returns Đối tượng cấu hình bộ chọn màu
 */
function getColorPickerConfig() {
    return {
        format: 'hex',
    };
}
/**
 * Trả về cấu hình kích thước font cho document builder
 * @returns Mảng các tùy chọn kích thước font được định sẵn
 */
function getFontSizeOptions() {
    return [
        {
            title: '9',
            model: '9pt',
            view: {
                name: 'span',
                styles: { 'font-size': '9pt' },
                priority: 7,
            },
        },
        {
            title: '10',
            model: '10pt',
            view: {
                name: 'span',
                styles: { 'font-size': '10pt' },
                priority: 7,
            },
        },
        {
            title: '11',
            model: '11pt',
            view: {
                name: 'span',
                styles: { 'font-size': '11pt' },
                priority: 7,
            },
        },
        {
            title: '12',
            model: '12pt',
            view: {
                name: 'span',
                styles: { 'font-size': '12pt' },
                priority: 7,
            },
        },
        {
            title: '13',
            model: '13pt',
            view: {
                name: 'span',
                styles: { 'font-size': '13pt' },
                priority: 7,
            },
        },
        {
            title: '14',
            model: '14pt',
            view: {
                name: 'span',
                styles: { 'font-size': '14pt' },
                priority: 7,
            },
        },
        {
            title: '16',
            model: '16pt',
            view: {
                name: 'span',
                styles: { 'font-size': '16pt' },
                priority: 7,
            },
        },
        {
            title: '18',
            model: '18pt',
            view: {
                name: 'span',
                styles: { 'font-size': '18pt' },
                priority: 7,
            },
        },
        {
            title: '20',
            model: '20pt',
            view: {
                name: 'span',
                styles: { 'font-size': '20pt' },
                priority: 7,
            },
        },
        {
            title: '24',
            model: '24pt',
            view: {
                name: 'span',
                styles: { 'font-size': '24pt' },
                priority: 7,
            },
        },
    ];
}
function getHeadingOptions() {
    return [
        {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph',
        },
        {
            model: 'heading1',
            view: {
                name: 'h1',
                styles: { 'font-size': '24pt', 'font-weight': 'bold', 'line-height': '1.15' },
            },
            title: 'Heading 1',
            class: 'ck-heading_heading1',
        },
        {
            model: 'heading2',
            view: {
                name: 'h2',
                styles: { 'font-size': '20pt', 'font-weight': 'bold', 'line-height': '1.15' },
            },
            title: 'Heading 2',
            class: 'ck-heading_heading2',
        },
        {
            model: 'heading3',
            view: {
                name: 'h3',
                styles: { 'font-size': '16pt', 'font-weight': 'bold', 'line-height': '1.15' },
            },
            title: 'Heading 3',
            class: 'ck-heading_heading3',
        },
    ];
}

class HeadingPlugin extends Plugin {
    static get pluginName() {
        return 'HeadingPlugin';
    }
    init() {
        const editor = this.editor;
        editor.conversion.for('editingDowncast').markerToHighlight({
            model: 'highlightMarker',
            view: {
                classes: 'ck-heading-highlight',
            },
        });
        // Lấy default styles từ config
        const headingOptions = getHeadingOptions();
        const headingDefaults = {};
        headingOptions?.forEach((opt) => {
            if (opt.model?.match(/^heading[1-3]$/)) {
                headingDefaults[opt.model] = {
                    fontSize: opt.view?.styles?.['font-size'] || 'inherit',
                    lineHeight: opt.view?.styles?.['line-height'] || 'inherit',
                };
            }
        });
        // Downcast: Kiểm tra heading có styled text và set style inherit
        const downcastConversion = editor.conversion.for('downcast');
        Object.keys(headingDefaults).forEach(modelName => {
            downcastConversion.add(dispatcher => {
                dispatcher.on(`insert:${modelName}`, createHeadingHandler(editor, modelName, headingDefaults), { priority: 'low' });
            });
        });
    }
}
function createHeadingHandler(editor, modelName, headingDefaults) {
    return (evt, data, conversionApi) => {
        const element = data.item;
        const viewElement = editor.editing.mapper.toViewElement(element);
        if (!viewElement)
            return;
        const children = Array.from(element.getChildren());
        const hasStyledText = children.some((child) => {
            if (child.is('$text')) {
                const attrs = Array.from(child.getAttributes());
                return attrs.length > 0;
            }
            return !child.is('$text');
        });
        editor.editing.view.change((writer) => {
            if (children.length === 1 && hasStyledText) {
                // Có styled text → bỏ style mặc định
                writer.setStyle('font-size', 'inherit', viewElement);
                writer.setStyle('line-height', 'inherit', viewElement);
            }
            else {
                // Không có styled text → set lại style mặc định từ config
                const defaults = headingDefaults[modelName];
                writer.setStyle('font-size', defaults.fontSize, viewElement);
                writer.setStyle('line-height', defaults.lineHeight, viewElement);
            }
        });
    };
}

class VariablePlugin extends Plugin {
    // Tên plugin đăng ký với CKEditor — bắt buộc để tìm kiếm bằng string và ổn định trong build minified
    static get pluginName() {
        return 'VariablePlugin';
    }
    static get requires() {
        return [Widget];
    }
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const conversion = editor.conversion;
        const editingView = editor.editing.view;
        // Cờ đánh dấu đang trong quá trình xử lý paste
        let isPasting = false;
        this.listenTo(editingView.document, 'clipboardInput', () => {
            isPasting = true;
            // Reset cờ sau khi quá trình paste (ngay trong cùng event loop/tick) hoàn tất
            setTimeout(() => {
                isPasting = false;
            }, 0);
        }, { priority: 'highest' });
        // 1. Định nghĩa Schema (Model)
        schema.register('variable', {
            inheritAllFrom: '$inlineObject',
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributes: ['id', 'uuid', 'value', 'display', 'bindingValue'],
        });
        // 2. Model -> HTML
        // model là string 'variable' → chỉ chạy khi element được TẠO MỚI (không reconvert khi attribute đổi)
        // Luôn render trạng thái UNBOUND tại đây — binding state được xử lý riêng bởi converter bên dưới
        conversion.for('downcast').elementToElement({
            model: 'variable',
            view: (modelItem, { writer: viewWriter }) => {
                const id = modelItem.getAttribute('id');
                const uuid = modelItem.getAttribute('uuid');
                const display = modelItem.getAttribute('display');
                const value = modelItem.getAttribute('value');
                const widgetElement = viewWriter.createContainerElement('span', {
                    class: 'variable-widget',
                    'data-id': id,
                    'data-value': value,
                    'data-display': display,
                    'data-binding': 'false', // Luôn bắt đầu unbound — binding chỉ set qua bindValue()
                });
                const innerText = viewWriter.createText(`{{${display}}}`);
                viewWriter.insert(viewWriter.createPositionAt(widgetElement, 0), innerText);
                return toWidget(widgetElement, viewWriter);
            },
        });
        // 2b. bindingValue → view
        // - editingDowncast: HTML bind dùng createRawElement để hiển thị table/section trong editor.
        // - dataDowncast (getData): CHỈ lưu data-binding-value (URI), không chèn block HTML vào <span> —
        //   tránh HTML lưu dạng <p><span>…<table>… (invalid / upcast CKEditor lỗi null.start).
        const applyBindingValueAttributeToView = (isDataPipeline) => {
            return (evt, data, conversionApi) => {
                if (!conversionApi.consumable.consume(data.item, evt.name))
                    return;
                const viewWriter = conversionApi.writer;
                const viewElement = conversionApi.mapper.toViewElement(data.item);
                if (!viewElement)
                    return;
                const bindingValue = data.attributeNewValue;
                const isBound = !!bindingValue;
                const display = data.item.getAttribute('display');
                viewWriter.remove(viewWriter.createRangeIn(viewElement));
                if (!isBound) {
                    viewWriter.setAttribute('data-binding', 'false', viewElement);
                    viewWriter.removeAttribute('data-binding-value', viewElement);
                    viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), viewWriter.createText(`{{${display}}}`));
                    return;
                }
                const raw = bindingValue;
                const isHtml = /<[a-z][\s\S]*>/i.test(raw);
                if (isHtml) {
                    viewWriter.setAttribute('data-binding', 'html', viewElement);
                    viewWriter.setAttribute('data-binding-value', encodeURIComponent(raw), viewElement);
                    if (isDataPipeline) {
                        // Không nhét DOM con vào serialized HTML; upcast đọc binding từ data-binding-value.
                        return;
                    }
                    const htmlHost = viewWriter.createRawElement('span', { class: 'variable-html-content' }, (domElement) => {
                        domElement.innerHTML = raw;
                    });
                    viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), htmlHost);
                }
                else {
                    viewWriter.setAttribute('data-binding', 'true', viewElement);
                    viewWriter.removeAttribute('data-binding-value', viewElement);
                    viewWriter.insert(viewWriter.createPositionAt(viewElement, 0), viewWriter.createText(raw));
                }
            };
        };
        conversion.for('dataDowncast').add(dispatcher => {
            dispatcher.on('attribute:bindingValue:variable', applyBindingValueAttributeToView(true));
        });
        conversion.for('editingDowncast').add(dispatcher => {
            dispatcher.on('attribute:bindingValue:variable', applyBindingValueAttributeToView(false));
        });
        // 3. HTML -> Model
        conversion.for('upcast').elementToElement({
            // NOTE: Chỉ khai báo các attribute CẦN THIẾT để nhận biết variable widget.
            // - data-binding KHÔNG được đưa vào required attributes (HTML cũ không có sẽ không được nhận biết).
            // - data-binding="true" → đọc text child làm bindingValue (plain text).
            // - data-binding="html" → đọc data-binding-value (URI-encoded) làm bindingValue.
            view: {
                name: 'span',
                classes: 'variable-widget ck-widget',
                attributes: {
                    'data-id': true,
                    'data-value': true,
                    'data-display': true,
                    contenteditable: true,
                },
            },
            model: (viewElement, { writer: modelWriter }) => {
                const bindingMode = viewElement.getAttribute('data-binding');
                let bindingValue;
                if (bindingMode === 'html') {
                    const encoded = viewElement.getAttribute('data-binding-value');
                    if (encoded) {
                        try {
                            bindingValue = decodeURIComponent(encoded);
                        }
                        catch {
                            bindingValue = undefined;
                        }
                    }
                }
                else if (bindingMode === 'true') {
                    // Đọc text content làm bindingValue (bound value được lưu trực tiếp vào inner text)
                    for (const child of viewElement.getChildren()) {
                        if (child.is('$text')) {
                            bindingValue = child.data;
                            break;
                        }
                    }
                }
                return modelWriter.createElement('variable', {
                    id: viewElement.getAttribute('data-id'),
                    // Fix trùng uuid: Nếu đang paste, TẠO MỚI uuid thay vì dùng uuid cũ từ HTML
                    uuid: isPasting ? Utilities.generateUuid() : (viewElement.getAttribute('data-uuid') ?? Utilities.generateUuid()),
                    value: viewElement.getAttribute('data-value'),
                    display: viewElement.getAttribute('data-display'),
                    ...(bindingValue ? { bindingValue } : {}),
                });
            },
        });
        // 4. Xử lý sự kiện Drop
        this.listenTo(editingView.document, 'drop', async (evt, data) => {
            const dataTransfer = data.dataTransfer;
            const jsonData = dataTransfer.getData('ck-variable');
            if (!jsonData)
                return;
            // data.dropRange là vị trí con chuột trên View khi thả
            const viewRange = data.dropRange;
            const modelRange = editor.editing.mapper.toModelRange(viewRange);
            evt.stop();
            try {
                let variable = JSON.parse(jsonData);
                const config = editor.config;
                const getOption = config.get('getOption');
                const option = getOption?.();
                if (option?.onDropVariable) {
                    // Bug 4 Fix (Q2-A): Xóa tham số dropIndex — không còn tryền giá trị hardcode 0
                    const result = await resolveMaybeAsync(option.onDropVariable(variable));
                    // * Hỗ trợ dữ liệu có sẵn sẽ chỉ cần nhận vào boolean có cho phép thả hay không?
                    // i18n nằm trong editor.config — plugin không có DI nên đọc qua config; Angular wrapper luôn truyền _i18n
                    const i18n = editor.config.get('_i18n');
                    if (typeof result === 'boolean') {
                        if (!result) {
                            throw new Error(i18n?.t('core.component.document-builder.variable.not-allowed') ?? '');
                        }
                    }
                    else {
                        // * Hỗ trợ dữ liệu lấy từ API (Kiểm tra xem result có đúng định dạng interface SdDocumentBuilderVariable hay không?)
                        if (this.#isSdDocumentBuilderVariableResult(result)) {
                            variable = result;
                        }
                        else {
                            throw new Error(i18n?.t('core.component.document-builder.variable.invalid-data') ?? '');
                        }
                    }
                }
                let insertedUuid = '';
                editor.model.change(writer => {
                    // 4.1. Chèn biến
                    insertedUuid = Utilities.generateUuid();
                    const variableElem = writer.createElement('variable', {
                        id: variable.id,
                        uuid: insertedUuid,
                        value: variable.value,
                        display: variable.display,
                    });
                    editor.model.insertContent(variableElem, modelRange);
                    // 4.2. Đặt con trỏ ra sau biến
                    writer.setSelection(variableElem, 'after');
                });
                // onAfterDropVariable: fires SAU model.change() → variable đã có trong model
                // Consumer có thể gọi variable.all() tại đây và thấy biến mới nhất
                option?.onAfterDropVariable?.({ ...variable, uuid: insertedUuid });
            }
            catch (e) {
                // Đặt con trỏ ngay tại vị trí lỗi
                if (modelRange) {
                    editor.model.change(writer => {
                        writer.setSelection(modelRange);
                    });
                }
                console.error(e);
            }
            finally {
                // 5. Dọn dẹp drop-target dù thành công hay lỗi
                editor.model.change(writer => {
                    for (const marker of editor.model.markers) {
                        if (marker.name.startsWith('drop-target')) {
                            writer.removeMarker(marker);
                        }
                    }
                });
            }
        });
        // -------------------------------------------------------------------------
        // 5 & 6. Navigation (Arrow keys + Mouse) + Cursor spacing sau variable
        // -------------------------------------------------------------------------
        // Bug 1 Fix: isNavigating cần được reset sau mỗi lần change:range xử lý xong
        // để tránh logic chèn \u00A0 chạy lặp khi có selection change programmatic.
        let isNavigating = false;
        // Opt 1: Gộp arrow-key detection + Backspace/Delete handler vào 1 listener keydown
        // Bug 3 Fix: Dùng this.listenTo() thay .on() để CKEditor tự cleanup khi plugin destroy
        this.listenTo(editingView.document, 'keydown', (evt, data) => {
            const keyCode = data.keyCode;
            // --- Arrow key navigation detection (priority: high) ---
            // Mã phím mũi tên: 37 (Left), 38 (Up), 39 (Right), 40 (Down)
            const isArrowKey = keyCode >= 37 && keyCode <= 40;
            if (isArrowKey) {
                isNavigating = true;
                return; // không xử lý thêm cho arrow key ở đây
            }
            // Reset flag nếu nhấn phím khác (không phải arrow, không phải Backspace/Delete)
            const btnBackspace = keyCode === 8;
            const btnDelete = keyCode === 46;
            if (!btnBackspace && !btnDelete) {
                isNavigating = false;
                return;
            }
            // --- Opt 1: Backspace / Delete handler (đã gộp vào cùng listener) ---
            // priority: highest — chạy trước mọi handler khác để bắt xóa variable 2 bước
            const selection = editor.model.document.selection;
            const model = editor.model;
            // CASE 1: Nếu con trỏ đang nhấp nháy (Collapsed)
            if (selection.isCollapsed) {
                const position = selection.getFirstPosition();
                // Với Backspace ta kiểm tra nodeBefore, với Delete ta kiểm tra nodeAfter
                const targetNode = btnBackspace ? position?.nodeBefore : position?.nodeAfter;
                if (targetNode && targetNode.is('element', 'variable')) {
                    data.preventDefault();
                    evt.stop();
                    model.change(writer => {
                        // Chọn bao quanh Variable đó (lần bấm tiếp theo sẽ xóa)
                        writer.setSelection(targetNode, 'on');
                    });
                    return;
                }
            }
            // CASE 2: Nếu đang có một vùng chọn (đã được highlight từ lần bấm trước)
            else {
                const selectedElement = selection.getSelectedElement();
                // Nếu phần tử đang được chọn chính là variable → xóa hẳn
                if (selectedElement && selectedElement.is('element', 'variable')) {
                    data.preventDefault();
                    evt.stop();
                    model.change(writer => {
                        writer.remove(selectedElement);
                    });
                }
            }
        }, 
        // priority: highest — Backspace/Delete phải chạy trước CKEditor default để bắt 2-step deletion
        { priority: 'highest' });
        // Bug 3 Fix: mousedown cũng dùng this.listenTo() để tránh memory leak
        this.listenTo(editingView.document, 'mousedown', () => {
            isNavigating = true;
        });
        this.listenTo(editor.model.document.selection, 'change:range', () => {
            // Nếu không phải là hành động click hoặc mũi tên thì thoát hàm.
            if (!isNavigating) {
                return;
            }
            // Bug 1 Fix: Reset ngay sau khi vào handler để tránh chạy lặp
            // khi có thêm selection change programmatic (VD: writer.insertText bên dưới tự trigger lại)
            isNavigating = false;
            const model = editor.model;
            const selection = model.document.selection;
            if (!selection.isCollapsed)
                return;
            const position = selection.getFirstPosition();
            const nodeBefore = position?.nodeBefore;
            if (!position)
                return;
            // Kiểm tra: Node đứng trước con trỏ là variable
            if (nodeBefore && nodeBefore.is('element', 'variable')) {
                // Lấy node ngay sau variable để kiểm tra
                const nextNode = nodeBefore.nextSibling;
                // Logic: Nếu phía sau KHÔNG CÓ GÌ hoặc KHÔNG PHẢI LÀ TEXT → chèn \u00A0 để có thể gõ tiếp
                if (!nextNode || !nextNode.is('$text')) {
                    model.change(writer => {
                        writer.insertText('\u00A0', nodeBefore, 'after');
                        // Lấy vị trí ngay sau variable (lúc này đang là đầu của text node mới)
                        const posAfterVariable = writer.createPositionAfter(nodeBefore);
                        // Dịch chuyển vị trí đó sang phải 1 đơn vị (bỏ qua ký tự vừa thêm)
                        const targetPos = posAfterVariable.getShiftedBy(1);
                        writer.setSelection(targetPos);
                    });
                }
            }
        });
        // -------------------------------------------------------------------------
        // 8. Xử lý sự kiện Copy / Cut (Clipboard Output)
        // -------------------------------------------------------------------------
        // priority: low — chạy sau CKEditor để bổ sung text/plain fallback, không can thiệp HTML
        this.listenTo(editor.editing.view.document, 'clipboardOutput', (evt, data) => {
            const isCopyOrCut = data.method === 'copy' || data.method === 'cut';
            if (!isCopyOrCut)
                return;
            const dataTransfer = data.dataTransfer;
            const content = data.content;
            // Opt 3: Chỉ visit element nodes, bỏ qua các node không liên quan
            let plainText = '';
            const viewRange = editor.editing.view.createRangeIn(content);
            for (const item of viewRange.getItems()) {
                if (item.is('$text')) {
                    plainText += item.data;
                }
                else if (item.is('element', 'span') && item.hasClass('variable-widget')) {
                    const display = item.getAttribute('data-display');
                    if (display)
                        plainText += `{{${display}}}`;
                }
            }
            if (plainText) {
                dataTransfer.setData('text/plain', plainText);
            }
            // HTML content giữ nguyên — CKEditor sẽ tự xử lý upcast khi paste lại
        }, { priority: 'low' });
        // -------------------------------------------------------------------------
        // 9. Xử lý sự kiện Paste (Clipboard Input)
        // -------------------------------------------------------------------------
        // Nếu paste từ external source (chỉ có text, không có HTML variable)
        // thì chuyển {{text}} thành variable widget
        this.listenTo(editor.editing.view.document, 'clipboardInput', async (evt, data) => {
            const dataTransfer = data.dataTransfer;
            // Nếu có HTML chứa variable-widget thì để CKEditor xử lý (upcast converter)
            // Việc chống trùng uuid (regenerate) đã được xử lý ở upcast converter dựa vào biến isPasting
            let html = dataTransfer.getData('text/html');
            if (html && html.includes('variable-widget')) {
                return;
            }
            // Chỉ xử lý nếu chỉ có plain text với pattern {{text}}
            const text = dataTransfer.getData('text/plain');
            if (!text)
                return;
            // Kiểm tra có chứa pattern {{text}} không
            const variablePattern = /\{\{([^}]+)\}\}/g;
            if (!variablePattern.test(text)) {
                return;
            }
            // Reset lastIndex sau khi test
            variablePattern.lastIndex = 0;
            evt.stop();
            // Bug 2 Fix (Q1-A): Lấy option để gọi onPasteVariable callback nếu có
            const config = editor.config;
            const getOption = config.get('getOption');
            const option = getOption?.();
            // Tách text thành các phần: normal text và variables
            let lastIndex = 0;
            let match;
            const fragments = [];
            while ((match = variablePattern.exec(text)) !== null) {
                // Thêm text trước variable
                if (match.index > lastIndex) {
                    fragments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
                }
                fragments.push({ type: 'variable', content: match[0], display: match[1] });
                lastIndex = match.index + match[0].length;
            }
            // Thêm text còn lại sau variable cuối cùng
            if (lastIndex < text.length) {
                fragments.push({ type: 'text', content: text.slice(lastIndex) });
            }
            // Bug 2 Fix: Resolve tất cả variable fragments trước khi thực hiện model.change
            // Tránh async operation bên trong model.change (CKEditor không hỗ trợ async writer)
            // Xây dựng lookup map từ variables đang có trong document (theo display name)
            // Dùng để fallback khi không có onPasteVariable — giữ lại đầy đủ id/value của biến gốc
            // khi copy-paste nội bộ bị mất HTML (chỉ còn plain text {{display}})
            const existingVariableMap = this.#buildDisplayMap();
            const resolvedFragments = [];
            for (const fragment of fragments) {
                if (fragment.type === 'variable' && fragment.display) {
                    let resolved = null;
                    if (option?.onPasteVariable) {
                        try {
                            resolved = await resolveMaybeAsync(option.onPasteVariable(fragment.display));
                        }
                        catch (e) {
                            // @i18n-ignore — dev console warning
                            console.warn(`[VariablePlugin] onPasteVariable("${fragment.display}") thất bại:`, e);
                        }
                    }
                    // Fallback 1: Tra cứu variable đang có trong document theo display name
                    // → Giữ lại đầy đủ id/value khi copy-paste nội bộ bị mất HTML
                    if (!resolved) {
                        resolved = existingVariableMap.get(fragment.display) ?? null;
                    }
                    // Fallback 2: Không tìm thấy → tạo variable sentinel với id = ''
                    // Consumer có thể filter qua variable.all() và nhận biết bằng id === ''
                    resolvedFragments.push({
                        type: 'variable',
                        content: fragment.content,
                        variable: resolved ?? {
                            id: '',
                            uuid: Utilities.generateUuid(),
                            value: fragment.display,
                            display: fragment.display,
                        },
                    });
                }
                else {
                    resolvedFragments.push({ type: 'text', content: fragment.content });
                }
            }
            // Chèn từng fragment vào document
            editor.model.change(writer => {
                const selection = editor.model.document.selection;
                const position = selection.getFirstPosition();
                if (!position)
                    return;
                let currentPosition = position;
                for (const fragment of resolvedFragments) {
                    if (fragment.type === 'text' && fragment.content) {
                        const textNode = writer.createText(fragment.content);
                        writer.insert(textNode, currentPosition);
                        currentPosition = writer.createPositionAfter(textNode);
                    }
                    else if (fragment.type === 'variable' && fragment.variable) {
                        const variableElem = writer.createElement('variable', {
                            id: fragment.variable.id,
                            uuid: Utilities.generateUuid(),
                            value: fragment.variable.value,
                            display: fragment.variable.display,
                        });
                        writer.insert(variableElem, currentPosition);
                        currentPosition = writer.createPositionAfter(variableElem);
                    }
                }
                // Đặt con trỏ sau nội dung vừa paste
                writer.setSelection(currentPosition);
            });
        }, { priority: 'high' });
    }
    #isSdDocumentBuilderVariableResult = (obj) => {
        return (obj !== null &&
            obj !== undefined &&
            typeof obj === 'object' &&
            !Array.isArray(obj) &&
            typeof obj.id === 'string' &&
            typeof obj.value === 'string' &&
            typeof obj.display === 'string');
    };
    /**
     * Quét tất cả variable elements trong document hiện tại, trả về Map<display, SdDocumentBuilderVariable>.
     * Dùng làm fallback khi paste {{display}} mà không có onPasteVariable callback:
     * nếu document đã có variable cùng display → tái sử dụng id/value của biến gốc.
     * Nếu có nhiều variable cùng display → lấy cái đầu tiên tìm được.
     */
    #buildDisplayMap = () => {
        const map = new Map();
        const root = this.editor.model.document.getRoot();
        if (!root)
            return map;
        const range = this.editor.model.createRangeIn(root);
        for (const item of range.getItems()) {
            if (item.is('element', 'variable')) {
                const display = item.getAttribute('display');
                // Chỉ lưu lần đầu tiên gặp display này
                if (display && !map.has(display)) {
                    map.set(display, {
                        id: item.getAttribute('id'),
                        uuid: item.getAttribute('uuid'),
                        value: item.getAttribute('value'),
                        display,
                    });
                }
            }
        }
        return map;
    };
    // =========================================================================
    // PUBLIC API — Variable management
    // =========================================================================
    /**
     * Lấy tất cả variables trong document.
     * @returns Danh sách tất cả variables (bao gồm bindingValue nếu đã binding)
     */
    all() {
        const model = this.editor.model;
        const root = model.document.getRoot();
        if (!root)
            return [];
        const variables = [];
        try {
            const range = model.createRangeIn(root);
            for (const item of range.getItems()) {
                if (item.is('element', 'variable')) {
                    variables.push({
                        id: item.getAttribute('id'),
                        uuid: item.getAttribute('uuid'),
                        value: item.getAttribute('value'),
                        display: item.getAttribute('display'),
                        bindingValue: item.getAttribute('bindingValue'),
                    });
                }
            }
        }
        catch (e) {
            console.error(e);
            return [];
        }
        return variables;
    }
    /**
     * Scroll tới vị trí của variable theo uuid.
     * @param uuid - uuid của variable (FE tự sinh sau mỗi lần drop)
     */
    scroll(uuid) {
        const model = this.editor.model;
        const root = model.document.getRoot();
        if (!root)
            return;
        let targetElement = null;
        const range = model.createRangeIn(root);
        for (const item of range.getItems()) {
            if (item.is('element', 'variable') && item.getAttribute('uuid') === uuid) {
                targetElement = item;
                break;
            }
        }
        if (targetElement) {
            const viewElement = this.editor.editing.mapper.toViewElement(targetElement);
            if (viewElement) {
                const domElement = this.editor.editing.view.domConverter.viewToDom(viewElement);
                if (domElement) {
                    domElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    model.change(writer => {
                        writer.setSelection(targetElement, 'on');
                    });
                }
            }
        }
        else {
            // @i18n-ignore — dev console warning
            console.warn(`Variable với uuid "${uuid}" không tìm thấy trong tài liệu.`);
        }
    }
    /**
     * Gán giá trị cho TẤT CẢ variable có cùng id trong document.
     * Nếu value rỗng → tự động gọi clearValue(id).
     * @param id    - id của variable definition
     * @param value - giá trị binding cần hiển thị
     * @returns số instance đã được cập nhật
     */
    bindValue(id, value) {
        if (!value)
            return this.clearValue(id);
        const model = this.editor.model;
        const root = model.document.getRoot();
        if (!root)
            return 0;
        let count = 0;
        model.change(writer => {
            const range = model.createRangeIn(root);
            for (const item of range.getItems()) {
                if (item.is('element', 'variable') && item.getAttribute('id') === id) {
                    writer.setAttribute('bindingValue', value, item);
                    count++;
                }
            }
        });
        return count;
    }
    /**
     * Xóa binding value của TẤT CẢ variable có cùng id.
     * @param id - id của variable definition
     * @returns số instance đã được cập nhật
     */
    clearValue(id) {
        const model = this.editor.model;
        const root = model.document.getRoot();
        if (!root)
            return 0;
        let count = 0;
        model.change(writer => {
            const range = model.createRangeIn(root);
            for (const item of range.getItems()) {
                if (item.is('element', 'variable') && item.getAttribute('id') === id && item.hasAttribute('bindingValue')) {
                    writer.removeAttribute('bindingValue', item);
                    count++;
                }
            }
        });
        return count;
    }
    /**
     * Batch bind nhiều variables theo map { id → value }.
     * Toàn bộ thực hiện trong 1 model.change() → 1 undo step duy nhất.
     * @param map - { [id]: boundValue }
     */
    bindValues(map) {
        if (!Object.keys(map).length)
            return;
        const model = this.editor.model;
        const root = model.document.getRoot();
        if (!root)
            return;
        model.change(writer => {
            const range = model.createRangeIn(root);
            for (const item of range.getItems()) {
                if (!item.is('element', 'variable'))
                    continue;
                const id = item.getAttribute('id');
                if (!(id in map))
                    continue;
                const value = map[id];
                if (value) {
                    writer.setAttribute('bindingValue', value, item);
                }
                else if (item.hasAttribute('bindingValue')) {
                    writer.removeAttribute('bindingValue', item);
                }
            }
        });
    }
    /**
     * Batch clear binding của nhiều variables.
     * @param ids - danh sách id cần clear; nếu không truyền/rỗng → clear TẤT CẢ
     */
    clearValues(ids) {
        const model = this.editor.model;
        const root = model.document.getRoot();
        if (!root)
            return;
        const idSet = ids?.length ? new Set(ids) : null;
        model.change(writer => {
            const range = model.createRangeIn(root);
            for (const item of range.getItems()) {
                if (!item.is('element', 'variable') || !item.hasAttribute('bindingValue'))
                    continue;
                const id = item.getAttribute('id');
                if (!idSet || idSet.has(id)) {
                    writer.removeAttribute('bindingValue', item);
                }
            }
        });
    }
    /** Xóa toàn bộ binding values trong document. Shorthand của clearValues(). */
    clearAllValues() {
        this.clearValues();
    }
}
/**
 * HTML từ getData() phiên bản cũ có thể chứa block (vd. table) bên trong `span.variable-widget[data-binding="html"]`,
 * khiến setData/upcast CKEditor lỗi (unexpected-error, null.start). Gọi trước `setData` để giữ chỉ
 * `data-binding-value` và bỏ các node con.
 */
function sanitizeVariableHtmlBoundSerializedHtml(html) {
    if (!html || !html.includes('variable-widget'))
        return html;
    try {
        const doc = new DOMParser().parseFromString(`<div id="__sd_var_sanitize_root__">${html}</div>`, 'text/html');
        const root = doc.getElementById('__sd_var_sanitize_root__');
        if (!root)
            return html;
        root.querySelectorAll('span.variable-widget').forEach(el => {
            if (el.getAttribute('data-binding') !== 'html')
                return;
            if (!el.hasAttribute('data-binding-value'))
                return;
            el.replaceChildren();
        });
        return root.innerHTML;
    }
    catch {
        return html;
    }
}

class TableCustom extends Plugin {
    init() {
        const editor = this.editor;
        // Can thiệp vào quá trình convert từ View (HTML Paste) sang Model
        editor.conversion.for('upcast').add(dispatcher => {
            dispatcher.on('element:table', (evt, data) => {
                if (!data.modelRange)
                    return;
                for (const item of data.modelRange.getItems()) {
                    if (item.is('element', 'table')) {
                        editor.model.change(writer => {
                            this._applyTableDefaults(writer, item);
                            this._applyCellBorders(writer, item);
                        });
                    }
                }
            }, { priority: 'low' });
            // Xử lý data-column-widths từ colgroup preservation
            editor.conversion.for('upcast').attributeToAttribute({
                view: 'data-column-widths',
                model: 'tableColumnWidth'
            });
            // Xử lý border-style: none cho tableCell - phải explicit set 'none'
            dispatcher.on('element:td', (evt, data) => {
                if (!data.modelRange || !data.viewItem)
                    return;
                const viewElement = data.viewItem;
                const borderStyle = viewElement.getStyle('border-style') ||
                    this._parseBorderStyleFromShorthand(viewElement.getStyle('border'));
                // Nếu border-style là none hoặc border shorthand là none/0, explicit set 'none'
                if (borderStyle === 'none' || borderStyle === 'hidden') {
                    for (const item of data.modelRange.getItems()) {
                        if (item.is('element', 'tableCell')) {
                            editor.model.change(writer => {
                                writer.setAttribute('tableCellBorderStyle', 'none', item);
                                // Khi border là none, set width về 0 để không có border
                                writer.setAttribute('tableCellBorderWidth', '0pt', item);
                            });
                        }
                    }
                }
            }, { priority: 'high' });
            dispatcher.on('element:th', (evt, data) => {
                if (!data.modelRange || !data.viewItem)
                    return;
                const viewElement = data.viewItem;
                const borderStyle = viewElement.getStyle('border-style') ||
                    this._parseBorderStyleFromShorthand(viewElement.getStyle('border'));
                // Nếu border-style là none hoặc border shorthand là none/0, explicit set 'none'
                if (borderStyle === 'none' || borderStyle === 'hidden') {
                    for (const item of data.modelRange.getItems()) {
                        if (item.is('element', 'tableCell')) {
                            editor.model.change(writer => {
                                writer.setAttribute('tableCellBorderStyle', 'none', item);
                                // Khi border là none, set width về 0 để không có border
                                writer.setAttribute('tableCellBorderWidth', '0pt', item);
                            });
                        }
                    }
                }
            }, { priority: 'high' });
        });
        const findInnerTable = (viewElement) => {
            if (!viewElement)
                return null;
            if (viewElement.name === 'table')
                return viewElement;
            for (const child of viewElement.getChildren()) {
                if (child.name === 'table')
                    return child;
                const found = findInnerTable(child);
                if (found)
                    return found;
            }
            return null;
        };
        editor.conversion.for('downcast').add(dispatcher => {
            dispatcher.on('attribute:tableWidth:table', (evt, data, conversionApi) => {
                const viewWriter = conversionApi.writer;
                const viewElement = conversionApi.mapper.toViewElement(data.item);
                if (!viewElement)
                    return;
                const innerTable = findInnerTable(viewElement);
                if (!innerTable)
                    return;
                viewWriter.setStyle('border-collapse', 'collapse', innerTable);
                viewWriter.setStyle('margin', '0', innerTable);
                viewWriter.setStyle('width', '100%', innerTable);
                viewWriter.setStyle('width', '100%', viewElement);
            });
            dispatcher.on('insert:table', (evt, data, conversionApi) => {
                const viewWriter = conversionApi.writer;
                const viewElement = conversionApi.mapper.toViewElement(data.item);
                if (!viewElement)
                    return;
                const innerTable = findInnerTable(viewElement);
                if (!innerTable)
                    return;
                viewWriter.setStyle('border-collapse', 'collapse', innerTable);
                viewWriter.setStyle('margin', '0', innerTable);
                viewWriter.setStyle('width', '100%', innerTable);
                viewWriter.setStyle('width', '100%', viewElement);
            });
            // Downcast tableColumnWidth to colgroup
            dispatcher.on('attribute:tableColumnWidth:table', (evt, data, conversionApi) => {
                const viewWriter = conversionApi.writer;
                const viewElement = conversionApi.mapper.toViewElement(data.item);
                if (!viewElement)
                    return;
                const innerTable = findInnerTable(viewElement);
                if (!innerTable)
                    return;
                const columnWidths = data.item.getAttribute('tableColumnWidth');
                if (!columnWidths)
                    return;
                // Remove existing colgroup if any
                for (const child of innerTable.getChildren()) {
                    if (child.is('element', 'colgroup')) {
                        viewWriter.remove(child);
                        break;
                    }
                }
                // Create new colgroup with col elements
                const colgroup = viewWriter.createContainerElement('colgroup');
                const widths = columnWidths.split(',');
                for (const width of widths) {
                    const col = viewWriter.createEmptyElement('col');
                    viewWriter.setAttribute('width', width.trim(), col);
                    viewWriter.setStyle('width', width.trim(), col);
                    viewWriter.insertChild(0, col, colgroup);
                }
                // Insert colgroup as first child of table
                viewWriter.insertChild(0, colgroup, innerTable);
            });
        });
        // Lắng nghe lệnh insertTable
        const insertTableCommand = editor.commands.get('insertTable');
        if (insertTableCommand) {
            this.listenTo(insertTableCommand, 'execute', () => {
                editor.model.change(writer => {
                    const position = editor.model.document.selection.getFirstPosition();
                    if (!position)
                        return;
                    const tableElement = position.findAncestor('table');
                    if (tableElement) {
                        this._applyTableDefaults(writer, tableElement);
                        writer.setAttribute('tableBorderColor', '#000000', tableElement);
                        writer.setAttribute('tableBorderStyle', 'solid', tableElement);
                        writer.setAttribute('tableBorderWidth', '1pt', tableElement);
                        this._applyCellBorders(writer, tableElement);
                    }
                });
            });
        }
        // Listen for row/column commands
        const tableCommands = [
            'insertTableRowAbove',
            'insertTableRowBelow',
            'insertTableColumnLeft',
            'insertTableColumnRight',
            'resizeTableRow',
            'resizeTableColumn',
            'setTableColumnWidth',
            'tableColumnWidth'
        ];
        tableCommands.forEach(cmdName => {
            const cmd = editor.commands.get(cmdName);
            if (cmd) {
                this.listenTo(cmd, 'execute', () => {
                    editor.model.change(writer => {
                        const position = editor.model.document.selection.getFirstPosition();
                        if (!position)
                            return;
                        const tableElement = position.findAncestor('table');
                        if (tableElement) {
                            this._applyTableDefaults(writer, tableElement);
                            this._applyCellBorders(writer, tableElement);
                        }
                    });
                });
            }
        });
        // Setup style preservation on model change
        this._setupStylePreservationOnModelChange();
    }
    /**
     * Parse border style from CSS shorthand (e.g., "1px solid red" or "none")
     */
    _parseBorderStyleFromShorthand(borderValue) {
        if (!borderValue)
            return null;
        const val = borderValue.toLowerCase().trim();
        if (val === 'none' || val === '0')
            return 'none';
        // Parse shorthand: width style color (e.g., "1px solid red")
        const parts = val.split(/\s+/);
        for (const part of parts) {
            if (['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'].includes(part)) {
                return part;
            }
        }
        return null;
    }
    /**
     * Apply default table width
     */
    _applyTableDefaults(writer, tableElement) {
        if (!tableElement)
            return;
        writer.setAttribute('tableWidth', '100%', tableElement);
    }
    /**
     * Apply default borders to all cells in a table
     * Nếu cell đã có border rồi thì bỏ qua
     */
    _applyCellBorders(writer, tableElement) {
        if (!tableElement)
            return;
        // Lấy border info từ table để cell kế thừa
        const tableBorderColor = tableElement.getAttribute('tableBorderColor');
        const tableBorderStyle = tableElement.getAttribute('tableBorderStyle');
        const tableBorderWidth = tableElement.getAttribute('tableBorderWidth');
        for (const row of tableElement.getChildren()) {
            for (const cell of row.getChildren()) {
                // Nếu cell đã có border attribute nào rồi thì bỏ qua
                if (cell.hasAttribute('tableCellBorderStyle') ||
                    cell.hasAttribute('tableCellBorderColor') ||
                    cell.hasAttribute('tableCellBorderWidth')) {
                    continue;
                }
                // Áp dụng border từ table hoặc default
                const inheritedStyle = tableBorderStyle || 'solid';
                const inheritedColor = tableBorderColor || '#000000';
                const inheritedWidth = tableBorderWidth || '1pt';
                writer.setAttribute('tableCellBorderStyle', inheritedStyle, cell);
                writer.setAttribute('tableCellBorderColor', inheritedColor, cell);
                writer.setAttribute('tableCellBorderWidth', inheritedWidth, cell);
                if (!cell.hasAttribute('tableCellPadding')) {
                    writer.setAttribute('tableCellPadding', '0.4em', cell);
                }
            }
        }
    }
    /**
     * Setup listener to preserve cell/table styles when model changes
     */
    _setupStylePreservationOnModelChange() {
        const editor = this.editor;
        // Use listenTo for proper cleanup via destroy()
        this.listenTo(editor.model.document, 'change', (evt, batch) => {
            if (batch?.isLocal === false)
                return;
            const changes = editor.model.document.differ.getChanges();
            const tablesToFix = this._findTablesNeedingFix(changes);
            if (tablesToFix.size > 0) {
                editor.model.enqueueChange(() => {
                    editor.model.change(writer => {
                        for (const table of tablesToFix) {
                            this._applyTableDefaults(writer, table);
                            this._applyCellBorders(writer, table);
                        }
                    });
                });
            }
        });
    }
    /**
     * Find tables that need border fixes from model changes
     */
    _findTablesNeedingFix(changes) {
        const tablesToFix = new Set();
        for (const change of changes) {
            if (change.type === 'attribute') {
                const attrKey = change.attributeKey;
                if (attrKey && (attrKey.includes('table') || attrKey.includes('column') || attrKey.includes('width'))) {
                    const element = change.item;
                    if (element) {
                        const parentTable = this._findParentTable(element);
                        if (parentTable)
                            tablesToFix.add(parentTable);
                    }
                }
            }
            if (change.type === 'insert' && change.position) {
                const tableElement = change.position.findAncestor?.('table') ||
                    change.position.parent?.findAncestor?.('table');
                if (tableElement)
                    tablesToFix.add(tableElement);
            }
        }
        return tablesToFix;
    }
    /**
     * Find parent table element
     */
    _findParentTable(element) {
        if (!element)
            return null;
        let parent = element;
        while (parent && !parent.is?.('element', 'table')) {
            parent = parent.parent;
        }
        return parent;
    }
    /**
     * Cleanup listeners when plugin is destroyed
     * Note: this.listenTo() listeners are automatically cleaned up by super.destroy()
     */
    destroy() {
        super.destroy();
    }
}

class ImageUploadPlugin extends Plugin {
    static get pluginName() {
        return 'ImageUploadPlugin';
    }
    init() {
        const editor = this.editor;
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new Base64UploadAdapter(loader);
        };
    }
}
class Base64UploadAdapter {
    loader;
    constructor(loader) {
        this.loader = loader;
    }
    /**
     * Starts the upload process and converts the file to base64.
     * @returns Promise that resolves with the base64 URL
     */
    upload() {
        return this.loader.file.then((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Url = reader.result;
                    resolve({ default: base64Url });
                };
                reader.onerror = () => {
                    reject('Failed to convert image to base64');
                };
                reader.readAsDataURL(file);
            });
        });
    }
    /**
     * Aborts the upload process.
     */
    abort() {
        // For base64 conversion, there's nothing to abort
        // This method is required by the UploadAdapter interface
    }
}

class ImageCustomPlugin extends Plugin {
    static get pluginName() {
        return 'ImageCustomPlugin';
    }
    init() {
        const editor = this.editor;
        // Thiết lập style mặc định là alignCenter khi chèn ảnh
        editor.commands.get('imageUpload')?.on('execute', (evt, args) => {
            // Đặt style mặc định sau khi ảnh được chèn
            setTimeout(() => {
                const selection = editor.model.document.selection;
                const imageElement = selection.getSelectedElement();
                if (imageElement && (imageElement.name === 'imageBlock' || imageElement.name === 'imageInline')) {
                    const currentStyle = imageElement.getAttribute('imageStyle');
                    // Chỉ đặt mặc định nếu chưa có style nào
                    if (!currentStyle) {
                        editor.model.change(writer => {
                            writer.setAttribute('imageStyle', 'alignCenter', imageElement);
                        });
                    }
                }
            }, 0);
        });
        // Downcast: Model -> View (HTML output)
        // CKEditor 5 có 2 loại ảnh: imageBlock và imageInline
        editor.conversion.for('downcast').add(dispatcher => {
            // Xử lý ảnh block (được wrap trong figure)
            dispatcher.on('insert:imageBlock', (evt, data, conversionApi) => {
                this.handleImageInsert(evt, data, conversionApi);
            }, { priority: 'low' });
            // Xử lý ảnh inline
            dispatcher.on('insert:imageInline', (evt, data, conversionApi) => {
                this.handleImageInsert(evt, data, conversionApi);
            }, { priority: 'low' });
            // Xử lý thay đổi attribute cho cả 2 loại ảnh
            ['imageBlock', 'imageInline'].forEach(imageType => {
                // Xử lý thay đổi src
                dispatcher.on(`attribute:src:${imageType}`, (evt, data, conversionApi) => {
                    this.handleImageAttributeChange(evt, data, conversionApi);
                }, { priority: 'low' });
                // Xử lý thay đổi width
                dispatcher.on(`attribute:width:${imageType}`, (evt, data, conversionApi) => {
                    this.handleImageAttributeChange(evt, data, conversionApi);
                }, { priority: 'low' });
                // Xử lý thay đổi height
                dispatcher.on(`attribute:height:${imageType}`, (evt, data, conversionApi) => {
                    this.handleImageAttributeChange(evt, data, conversionApi);
                }, { priority: 'low' });
                // Xử lý thay đổi imageStyle (căn chỉnh) - thêm float inline style
                dispatcher.on(`attribute:imageStyle:${imageType}`, (evt, data, conversionApi) => {
                    this.handleImageStyleChange(evt, data, conversionApi);
                }, { priority: 'low' });
            });
        });
        // Xử lý upcast (HTML paste) - xóa aspect-ratio từ HTML đầu vào
        editor.conversion.for('upcast').add(dispatcher => {
            dispatcher.on('element:img', (evt, data, conversionApi) => {
                const viewItem = data.viewItem;
                if (!viewItem)
                    return;
                // Kiểm tra viewItem có các method cần thiết
                if (typeof viewItem.getStyle !== 'function')
                    return;
                // Xóa aspect-ratio từ inline styles nếu có
                const hasAspectRatio = viewItem.getStyle('aspect-ratio');
                if (hasAspectRatio && typeof viewItem.removeStyle === 'function') {
                    viewItem.removeStyle('aspect-ratio');
                }
                // Đặt custom styles nếu _styles map tồn tại
                if (viewItem._styles && typeof viewItem._styles.set === 'function') {
                    viewItem._styles.set('margin', '0');
                    viewItem._styles.set('border', '0');
                    viewItem._styles.set('max-width', '100%');
                    viewItem._styles.set('height', 'auto');
                }
            }, { priority: 'high' });
        });
    }
    /**
     * Xử lý sự kiện chèn ảnh
     */
    handleImageInsert(evt, data, conversionApi) {
        const viewWriter = conversionApi.writer;
        const viewElement = conversionApi.mapper.toViewElement(data.item);
        if (!viewElement)
            return;
        // viewElement có thể là figure (cho block) hoặc img itself (cho inline)
        // Tìm element img thực tế
        const imgElement = this.findImgElement(viewElement);
        if (!imgElement)
            return;
        this.applyCustomStyles(viewWriter, imgElement);
    }
    /**
     * Xử lý sự kiện thay đổi attribute ảnh
     */
    handleImageAttributeChange(evt, data, conversionApi) {
        const viewWriter = conversionApi.writer;
        const viewElement = conversionApi.mapper.toViewElement(data.item);
        if (!viewElement)
            return;
        const imgElement = this.findImgElement(viewElement);
        if (!imgElement)
            return;
        this.applyCustomStyles(viewWriter, imgElement);
    }
    /**
     * Xử lý sự kiện thay đổi style ảnh - thêm float inline style cho căn chỉnh
     */
    handleImageStyleChange(evt, data, conversionApi) {
        const viewWriter = conversionApi.writer;
        const viewElement = conversionApi.mapper.toViewElement(data.item);
        if (!viewElement)
            return;
        // Tìm container ck-widget (element figure)
        const widgetElement = this.findWidgetElement(viewElement);
        if (!widgetElement)
            return;
        // Lấy giá trị imageStyle (căn chỉnh)
        const imageStyle = data.item.getAttribute('imageStyle');
        // Xóa các style hiện có trước
        viewWriter.removeStyle('float', widgetElement);
        viewWriter.removeStyle('margin', widgetElement);
        viewWriter.removeStyle('text-align', widgetElement);
        // Áp dụng style dựa trên căn chỉnh ảnh
        // Các options đã cấu hình: ['inline', 'alignLeft', 'alignRight', 'alignCenter']
        switch (imageStyle) {
            case 'inline':
                // Ảnh inline - không style đặc biệt, chỉ flow inline
                break;
            case 'alignLeft':
                // Float trái
                viewWriter.setStyle('float', 'left', widgetElement);
                viewWriter.setStyle('margin', '0 16px 16px 0', widgetElement);
                break;
            case 'alignRight':
                // Float phải
                viewWriter.setStyle('float', 'right', widgetElement);
                viewWriter.setStyle('margin', '0 0 16px 16px', widgetElement);
                break;
            case 'alignCenter':
            case 'block':
                // Căn giữa
                viewWriter.setStyle('text-align', 'center', widgetElement);
                viewWriter.setStyle('margin', '16px auto', widgetElement);
                break;
            default:
                // Mặc định - căn giữa
                viewWriter.setStyle('text-align', 'center', widgetElement);
                viewWriter.setStyle('margin', '16px auto', widgetElement);
                break;
        }
        // Áp dụng custom styles cơ bản cho element img
        const imgElement = this.findImgElement(viewElement);
        if (imgElement) {
            this.applyCustomStyles(viewWriter, imgElement);
        }
    }
    /**
     * Áp dụng custom styles cho element ảnh
     */
    applyCustomStyles(viewWriter, imgElement) {
        // Xóa aspect-ratio nếu tồn tại
        if (imgElement.getStyle('aspect-ratio')) {
            viewWriter.removeStyle('aspect-ratio', imgElement);
        }
        // Áp dụng custom styles
        viewWriter.setStyle('margin', '0', imgElement);
        viewWriter.setStyle('border', '0', imgElement);
        viewWriter.setStyle('max-width', '100%', imgElement);
        viewWriter.setStyle('height', 'auto', imgElement);
    }
    /**
     * Tìm container ck-widget (element figure)
     * CKEditor wrap ảnh block trong <figure class="ck-widget"><img></figure>
     */
    findWidgetElement(viewElement) {
        if (!viewElement)
            return null;
        // Nếu đây là element figure itself
        if (viewElement.name === 'figure') {
            return viewElement;
        }
        // Cho ảnh inline, trả về element itself (span wrapper)
        if (viewElement.name === 'span') {
            return viewElement;
        }
        // Tìm ngược lên tree để tìm figure/ck-widget
        let current = viewElement;
        while (current) {
            if (current.name === 'figure' || current.name === 'span') {
                return current;
            }
            // Di chuyển lên parent
            if (current.parent) {
                current = current.parent;
            }
            else {
                break;
            }
        }
        // Nếu không tìm thấy widget, trả về element gốc
        return viewElement;
    }
    /**
     * Tìm element img thực tế bên trong widget structure
     * CKEditor wrap ảnh block trong <figure class="ck-widget"><img></figure>
     */
    findImgElement(viewElement) {
        if (!viewElement)
            return null;
        // Nếu đây là element img itself
        if (viewElement.name === 'img') {
            return viewElement;
        }
        // Cho structure widget của CKEditor, tìm đệ quy
        // Ảnh block: figure > span > img
        // Ảnh thường được wrap trong một container
        const queue = [viewElement];
        while (queue.length > 0) {
            const current = queue.shift();
            if (!current)
                continue;
            if (current.name === 'img') {
                return current;
            }
            // Thêm children vào queue
            if (current.getChildren) {
                for (const child of current.getChildren()) {
                    queue.push(child);
                }
            }
        }
        return null;
    }
}

// Icon khổ dọc (Mặc định cũ)
const ICON_PORTRAIT = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6V4h8v12z"/></svg>';
// Icon khổ ngang (Mới)
const ICON_LANDSCAPE = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 4H2C.9 4 0 4.9 0 6v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 10H2V6h16v8z"/></svg>';
class PageOrientation extends Plugin {
    static pluginName = 'PageOrientation';
    _currentOrientation = 'PORTRAIT';
    orientationChangeEmitter;
    buttonView;
    init() {
        const editor = this.editor;
        const componentFactory = editor.ui.componentFactory;
        // Đăng ký nút tên là 'pageOrientation'
        componentFactory.add('pageOrientation', locale => {
            const view = new ButtonView(locale);
            this.buttonView = view;
            view.set({
                // label: 'Xoay giấy (A4)',
                icon: ICON_PORTRAIT,
                // tooltip: true,
                // withText: true,
                class: 'btn-orientation', // Class để style nếu cần
            });
            // Xử lý khi bấm nút
            view.on('execute', () => {
                this.toggleOrientation();
            });
            return view;
        });
    }
    /**
     * Toggle between portrait and landscape orientation
     */
    toggleOrientation() {
        const newOrientation = this._currentOrientation === 'PORTRAIT' ? 'LANDSCAPE' : 'PORTRAIT';
        this.setOrientation(newOrientation);
    }
    /**
     * Set orientation programmatically
     */
    setOrientation(orientation) {
        const editor = this.editor;
        const editingView = editor.editing.view;
        const rootElement = editingView.document.getRoot();
        editor.editing.view.change(writer => {
            if (orientation === 'LANDSCAPE') {
                writer.addClass('landscape', rootElement);
            }
            else {
                writer.removeClass('landscape', rootElement);
            }
        });
        // Update button icon
        if (this.buttonView) {
            this.buttonView.icon = orientation === 'LANDSCAPE' ? ICON_LANDSCAPE : ICON_PORTRAIT;
        }
        this._currentOrientation = orientation;
        this.orientationChangeEmitter?.(orientation);
    }
    /**
     * Get current orientation
     */
    getOrientation() {
        return this._currentOrientation;
    }
    /**
     * Register callback for orientation changes
     */
    onOrientationChange(callback) {
        this.orientationChangeEmitter = callback;
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * Transforms `<a>` elements which are bookmarks by moving their children after the element.
 *
 * @internal
 */
function transformBookmarks(documentFragment, writer) {
    const elementsToChange = [];
    for (const value of writer.createRangeIn(documentFragment)) {
        const element = value.item;
        if (element.is('element', 'a') &&
            !element.hasAttribute('href') &&
            (element.hasAttribute('id') || element.hasAttribute('name'))) {
            elementsToChange.push(element);
        }
    }
    for (const element of elementsToChange) {
        const index = element.parent.getChildIndex(element) + 1;
        const children = element.getChildren();
        writer.insertChild(index, children, element.parent);
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/filters/image
 */
/**
 * Replaces source attribute of all `<img>` elements representing regular
 * images (not the Word shapes) with inlined base64 image representation extracted from RTF or Blob data.
 *
 * @param documentFragment Document fragment on which transform images.
 * @param rtfData The RTF data from which images representation will be used.
 * @internal
 */
function replaceImagesSourceWithBase64(documentFragment, rtfData) {
    if (!documentFragment.childCount) {
        return;
    }
    const upcastWriter = new ViewUpcastWriter(documentFragment.document);
    const shapesIds = findAllShapesIds(documentFragment, upcastWriter);
    removeAllImgElementsRepresentingShapes(shapesIds, documentFragment, upcastWriter);
    insertMissingImgs(shapesIds, documentFragment, upcastWriter);
    removeAllShapeElements(documentFragment, upcastWriter);
    const images = findAllImageElementsWithLocalSource(documentFragment, upcastWriter);
    if (images.length) {
        replaceImagesFileSourceWithInlineRepresentation(images, extractImageDataFromRtf(rtfData), upcastWriter);
    }
}
/**
 * Converts given HEX string to base64 representation.
 *
 * @internal
 * @param hexString The HEX string to be converted.
 * @returns Base64 representation of a given HEX string.
 */
function _convertHexToBase64(hexString) {
    return btoa(hexString
        .match(/\w{2}/g)
        .map(char => {
        return String.fromCharCode(parseInt(char, 16));
    })
        .join(''));
}
/**
 * Finds all shapes (`<v:*>...</v:*>`) ids. Shapes can represent images (canvas)
 * or Word shapes (which does not have RTF or Blob representation).
 *
 * @param documentFragment Document fragment from which to extract shape ids.
 * @returns Array of shape ids.
 */
function findAllShapesIds(documentFragment, writer) {
    const range = writer.createRangeIn(documentFragment);
    const shapeElementsMatcher = new Matcher({
        name: /v:(.+)/,
    });
    const shapesIds = [];
    for (const value of range) {
        if (value.type != 'elementStart') {
            continue;
        }
        const el = value.item;
        const previousSibling = el.previousSibling;
        const prevSiblingName = previousSibling && previousSibling.is('element') ? previousSibling.name : null;
        // List of ids which should not be considered as shapes.
        // https://github.com/ckeditor/ckeditor5/pull/15847#issuecomment-1941543983
        const exceptionIds = ['Chart'];
        const isElementAShape = shapeElementsMatcher.match(el);
        const hasElementGfxdataAttribute = el.getAttribute('o:gfxdata');
        const isPreviousSiblingAShapeType = prevSiblingName === 'v:shapetype';
        const isElementIdInExceptionsArray = hasElementGfxdataAttribute && exceptionIds.some(item => el.getAttribute('id').includes(item));
        // If shape element has 'o:gfxdata' attribute and is not directly before
        // `<v:shapetype>` element it means that it represents a Word shape.
        if (isElementAShape && hasElementGfxdataAttribute && !isPreviousSiblingAShapeType && !isElementIdInExceptionsArray) {
            shapesIds.push(value.item.getAttribute('id'));
        }
    }
    return shapesIds;
}
/**
 * Removes all `<img>` elements which represents Word shapes and not regular images.
 *
 * @param shapesIds Shape ids which will be checked against `<img>` elements.
 * @param documentFragment Document fragment from which to remove `<img>` elements.
 */
function removeAllImgElementsRepresentingShapes(shapesIds, documentFragment, writer) {
    const range = writer.createRangeIn(documentFragment);
    const imageElementsMatcher = new Matcher({
        name: 'img',
    });
    const imgs = [];
    for (const value of range) {
        if (value.item.is('element') && imageElementsMatcher.match(value.item)) {
            const el = value.item;
            const shapes = el.getAttribute('v:shapes') ? el.getAttribute('v:shapes').split(' ') : [];
            if (shapes.length && shapes.every(shape => shapesIds.indexOf(shape) > -1)) {
                imgs.push(el);
                // Shapes may also have empty source while content is paste in some browsers (Safari).
            }
            else if (!el.getAttribute('src')) {
                imgs.push(el);
            }
        }
    }
    for (const img of imgs) {
        writer.remove(img);
    }
}
/**
 * Removes all shape elements (`<v:*>...</v:*>`) so they do not pollute the output structure.
 *
 * @param documentFragment Document fragment from which to remove shape elements.
 */
function removeAllShapeElements(documentFragment, writer) {
    const range = writer.createRangeIn(documentFragment);
    const shapeElementsMatcher = new Matcher({
        name: /v:(.+)/,
    });
    const shapes = [];
    for (const value of range) {
        if (value.type == 'elementStart' && shapeElementsMatcher.match(value.item)) {
            shapes.push(value.item);
        }
    }
    for (const shape of shapes) {
        writer.remove(shape);
    }
}
/**
 * Inserts `img` tags if there is none after a shape.
 */
function insertMissingImgs(shapeIds, documentFragment, writer) {
    const range = writer.createRangeIn(documentFragment);
    const shapes = [];
    for (const value of range) {
        if (value.type == 'elementStart' && value.item.is('element', 'v:shape')) {
            const id = value.item.getAttribute('id');
            if (shapeIds.includes(id)) {
                continue;
            }
            if (!containsMatchingImg(value.item.parent.getChildren(), id)) {
                shapes.push(value.item);
            }
        }
    }
    for (const shape of shapes) {
        const attrs = {
            src: findSrc(shape),
        };
        if (shape.hasAttribute('alt')) {
            attrs['alt'] = shape.getAttribute('alt');
        }
        const img = writer.createElement('img', attrs);
        writer.insertChild(shape.index + 1, img, shape.parent);
    }
    function containsMatchingImg(nodes, id) {
        for (const node of nodes) {
            /* istanbul ignore else -- @preserve */
            if (node.is('element')) {
                if (node.name == 'img' && node.getAttribute('v:shapes') == id) {
                    return true;
                }
                if (containsMatchingImg(node.getChildren(), id)) {
                    return true;
                }
            }
        }
        return false;
    }
    function findSrc(shape) {
        for (const child of shape.getChildren()) {
            /* istanbul ignore else -- @preserve */
            if (child.is('element') && child.getAttribute('src')) {
                return child.getAttribute('src');
            }
        }
        return '';
    }
}
/**
 * Finds all `<img>` elements in a given document fragment which have source pointing to local `file://` resource.
 * This function also tracks the index position of each image in the document, which is essential for
 * precise matching with hexadecimal representations in RTF data.
 *
 * @param documentFragment Document fragment in which to look for `<img>` elements.
 * @returns Array of found images along with their position index in the document.
 */
function findAllImageElementsWithLocalSource(documentFragment, writer) {
    const range = writer.createRangeIn(documentFragment);
    const imageElementsMatcher = new Matcher({
        name: 'img',
    });
    const imgs = [];
    let currentImageIndex = 0;
    for (const value of range) {
        if (value.item.is('element') && imageElementsMatcher.match(value.item)) {
            if (value.item.getAttribute('src').startsWith('file://')) {
                imgs.push({
                    element: value.item,
                    imageIndex: currentImageIndex,
                });
            }
            currentImageIndex++;
        }
    }
    return imgs;
}
/**
 * Extracts all images HEX representations from a given RTF data.
 *
 * @param rtfData The RTF data from which to extract images HEX representation.
 * @returns Array of found HEX representations. Each array item is an object containing:
 *
 * * hex Image representation in HEX format.
 * * type Type of image, `image/png` or `image/jpeg`.
 */
function extractImageDataFromRtf(rtfData) {
    if (!rtfData) {
        return [];
    }
    const regexPictureHeader = /{\\pict[\s\S]+?\\bliptag-?\d+(\\blipupi-?\d+)?({\\\*\\blipuid\s?[\da-fA-F]+)?[\s}]*?/;
    const regexPicture = new RegExp('(?:(' + regexPictureHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g');
    const images = rtfData.match(regexPicture);
    const result = [];
    if (images) {
        for (const image of images) {
            let imageType = false;
            if (image.includes('\\pngblip')) {
                imageType = 'image/png';
            }
            else if (image.includes('\\jpegblip')) {
                imageType = 'image/jpeg';
            }
            if (imageType) {
                result.push({
                    hex: image.replace(regexPictureHeader, '').replace(/[^\da-fA-F]/g, ''),
                    type: imageType,
                });
            }
        }
    }
    return result;
}
/**
 * Replaces `src` attribute value of all given images with the corresponding base64 image representation.
 * Uses the image index to precisely match with the correct hexadecimal representation from RTF data.
 *
 * @param imageElements Array of image elements along with their indices which will have their sources replaced.
 * @param imagesHexSources Array of images hex sources (usually the result of `extractImageDataFromRtf()` function).
 * Contains hexadecimal representations of ALL images in the document, not just those with `file://` URLs.
 * In XML documents, the same image might be defined both as base64 in HTML and as hexadecimal in RTF data.
 */
function replaceImagesFileSourceWithInlineRepresentation(imageElements, imagesHexSources, writer) {
    for (let i = 0; i < imageElements.length; i++) {
        const { element, imageIndex } = imageElements[i];
        const rtfHexSource = imagesHexSources[imageIndex];
        if (rtfHexSource) {
            const newSrc = `data:${rtfHexSource.type};base64,${_convertHexToBase64(rtfHexSource.hex)}`;
            writer.setAttribute('src', newSrc, element);
        }
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/filters/removemsattributes
 */
/**
 * Cleanup MS attributes like styles, attributes and elements.
 *
 * @param documentFragment element `data.content` obtained from clipboard.
 * @internal
 */
function removeMSAttributes(documentFragment) {
    const elementsToUnwrap = [];
    const writer = new ViewUpcastWriter(documentFragment.document);
    for (const { item } of writer.createRangeIn(documentFragment)) {
        if (!item.is('element')) {
            continue;
        }
        for (const className of item.getClassNames()) {
            if (/\bmso/gi.exec(className)) {
                writer.removeClass(className, item);
            }
        }
        for (const styleName of item.getStyleNames()) {
            if (/\bmso/gi.exec(styleName)) {
                writer.removeStyle(styleName, item);
            }
        }
        if (item.is('element', 'w:sdt') ||
            item.is('element', 'w:sdtpr') && item.isEmpty ||
            item.is('element', 'o:p') && item.isEmpty) {
            elementsToUnwrap.push(item);
        }
    }
    for (const item of elementsToUnwrap) {
        const itemParent = item.parent;
        const childIndex = itemParent.getChildIndex(item);
        writer.insertChild(childIndex, item.getChildren(), itemParent);
        writer.remove(item);
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/filters/utils
 */
/**
 * Normalizes CSS length value to 'px'.
 *
 * @internal
 */
function convertCssLengthToPx(value) {
    const numericValue = parseFloat(value);
    if (value.endsWith('pt')) {
        // 1pt = 1in / 72
        return toPx(numericValue * 96 / 72);
    }
    else if (value.endsWith('pc')) {
        // 1pc = 12pt = 1in / 6.
        return toPx(numericValue * 12 * 96 / 72);
    }
    else if (value.endsWith('in')) {
        // 1in = 2.54cm = 96px
        return toPx(numericValue * 96);
    }
    else if (value.endsWith('cm')) {
        // 1cm = 96px / 2.54
        return toPx(numericValue * 96 / 2.54);
    }
    else if (value.endsWith('mm')) {
        // 1mm = 1cm / 10
        return toPx(numericValue / 10 * 96 / 2.54);
    }
    return value;
}
/**
 * Returns true for value with 'px' unit.
 *
 * @internal
 */
function isPx(value) {
    return value !== undefined && value.endsWith('px');
}
/**
 * Returns a rounded 'px' value.
 *
 * @internal
 */
function toPx(value) {
    return Math.round(value) + 'px';
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * Applies border none for table and cells without a border specified.
 * Normalizes style length units to px.
 * Handles left block table alignment.
 *
 * @internal
 */
function transformTables(documentFragment, writer, hasTablePropertiesPlugin = false, hasExtendedTableBlockAlignment = false) {
    for (const item of writer.createRangeIn(documentFragment).getItems()) {
        if (!item.is('element', 'table') && !item.is('element', 'td') && !item.is('element', 'th')) {
            continue;
        }
        // In MS Word, left-aligned tables (default) have no align attribute on the `<table>` and are not wrapped in a `<div>`.
        // In such cases, we need to set `margin-left: 0` and `margin-right: auto` to indicate to the editor that
        // the table is block-aligned to the left.
        //
        // Center- and right-aligned tables in MS Word are wrapped in a `<div>` with the `align` attribute set to
        // `center` or `right`, respectively with no align attribute on the `<table>` itself.
        //
        // Additionally, the structure may change when pasting content from MS Word.
        // Some browsers (e.g., Safari) may insert extra elements around the table (e.g., a <span>),
        // so the surrounding `<div>` with the `align` attribute may end up being the table's grandparent.
        if (hasTablePropertiesPlugin && hasExtendedTableBlockAlignment && item.is('element', 'table')) {
            const directParent = item.parent?.is('element', 'div') ? item.parent : null;
            const grandParent = item.parent?.parent?.is('element', 'div') ? item.parent.parent : null;
            const divParent = directParent ?? grandParent;
            // Center block table alignment.
            if (divParent && divParent.getAttribute('align') === 'center' && !item.getAttribute('align')) {
                writer.setStyle('margin-left', 'auto', item);
                writer.setStyle('margin-right', 'auto', item);
            }
            // Right block table alignment.
            else if (divParent && divParent.getAttribute('align') === 'right' && !item.getAttribute('align')) {
                writer.setStyle('margin-left', 'auto', item);
                writer.setStyle('margin-right', '0', item);
            }
            // Left block table alignment.
            else if (!divParent && !item.getAttribute('align')) {
                writer.setStyle('margin-left', '0', item);
                writer.setStyle('margin-right', 'auto', item);
            }
        }
        const sides = ['left', 'top', 'right', 'bottom'];
        // As this is a pasted table, we do not want default table styles to apply here
        // so we set border node for sides that does not have any border style.
        // It is enough to verify border style as border color and border width properties have default values in DOM.
        if (sides.every(side => !item.hasStyle(`border-${side}-style`))) {
            writer.setStyle('border-style', 'none', item);
        }
        else {
            for (const side of sides) {
                if (!item.hasStyle(`border-${side}-style`)) {
                    writer.setStyle(`border-${side}-style`, 'none', item);
                }
            }
        }
        // Translate style length units to px.
        const props = ['width', 'height', ...sides.map(side => `border-${side}-width`), ...sides.map(side => `padding-${side}`)];
        for (const prop of props) {
            if (item.hasStyle(prop)) {
                writer.setStyle(prop, convertCssLengthToPx(item.getStyle(prop)), item);
            }
        }
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * Removes the `width:0px` style from table pasted from Google Sheets and `width="0"` attribute from Word tables.
 *
 * @param documentFragment element `data.content` obtained from clipboard
 * @internal
 */
function removeInvalidTableWidth(documentFragment, writer) {
    for (const child of writer.createRangeIn(documentFragment).getItems()) {
        if (child.is('element', 'table')) {
            // Remove invalid width style (Google Sheets: width:0px).
            if (child.getStyle('width') === '0px') {
                writer.removeStyle('width', child);
            }
            // Remove invalid width attribute (Word: width="0").
            if (child.getAttribute('width') === '0') {
                writer.removeAttribute('width', child);
            }
        }
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * Replaces MS Word specific footnotes references and definitions with proper elements.
 *
 * Things to know about MS Word footnotes:
 *
 * * Footnote references in Word are marked with `mso-footnote-id` style.
 * * Word does not support nested footnotes, so references within definitions are ignored.
 * * Word appends extra spaces after footnote references within definitions, which are trimmed.
 * * Footnote definitions list is marked with `mso-element: footnote-list` style it contain `mso-element: footnote` elements.
 * * Footnote definition might contain tables, lists and other elements, not only text. They are placed directly within `li` element,
 * without any wrapper (in opposition to text content of the definition, which is placed within `MsoFootnoteText` element).
 *
 * Example pseudo document showing MS Word footnote structure:
 *
 * ```html
 * <p>Text with footnote<a style='mso-footnote-id:ftn1'>[1]</a> reference.</p>
 *
 * <div style='mso-element:footnote-list'>
 * 	<div style='mso-element:footnote' id=ftn1>
 * 		<p class=MsoFootnoteText><a style='mso-footnote-id:ftn1'>[1]</a> Footnote content</p>
 * 		<table class="MsoTableGrid">...</table>
 * 	</div>
 * </div>
 * ```
 *
 * Will be transformed into:
 *
 * ```html
 * <p>Text with footnote<sup class="footnote"><a id="ref-footnote-ftn1" href="#footnote-ftn1">1</a></sup> reference.</p>
 *
 * <ol class="footnotes">
 * 	<li class="footnote-definition" id="footnote-ftn1">
 * 		<a href="#ref-footnote-ftn1" class="footnote-backlink">^</a>
 * 		<div class="footnote-content">
 * 			<p>Footnote content</p>
 * 			<table>...</table>
 * 		</div>
 * 	</li>
 * </ol>
 * ```
 *
 * @param documentFragment `data.content` obtained from clipboard.
 * @param writer The view writer instance.
 * @internal
 */
function replaceMSFootnotes(documentFragment, writer) {
    const msFootnotesRefs = new Map();
    const msFootnotesDefs = new Map();
    let msFootnotesDefinitionsList = null;
    // Phase 1: Collect all footnotes references and definitions. Find the footnotes definitions list element.
    for (const { item } of writer.createRangeIn(documentFragment)) {
        if (!item.is('element')) {
            continue;
        }
        // If spot a footnotes definitions element, let's store it. It'll be replaced later.
        // There should be only one such element in the document.
        if (item.getStyle('mso-element') === 'footnote-list') {
            msFootnotesDefinitionsList = item;
            continue;
        }
        // If spot a footnote reference or definition, store it in the corresponding map.
        if (item.hasStyle('mso-footnote-id')) {
            const msFootnoteDef = item.findAncestor('element', el => el.getStyle('mso-element') === 'footnote');
            if (msFootnoteDef) {
                // If it's a reference within a definition, ignore it and track only the definition.
                // MS Word do not support nested footnotes, so it's safe to assume that all references within
                // a definition point to the same definition.
                const msFootnoteDefId = msFootnoteDef.getAttribute('id');
                msFootnotesDefs.set(msFootnoteDefId, msFootnoteDef);
            }
            else {
                // If it's a reference outside of a definition, track it as a reference.
                const msFootnoteRefId = item.getStyle('mso-footnote-id');
                msFootnotesRefs.set(msFootnoteRefId, item);
            }
            continue;
        }
    }
    // If there are no footnotes references or definitions, or no definitions list, there's nothing to normalize.
    if (!msFootnotesRefs.size || !msFootnotesDefinitionsList) {
        return;
    }
    // Phase 2: Replace footnotes definitions list with proper element.
    const footnotesDefinitionsList = createFootnotesListViewElement(writer);
    writer.replace(msFootnotesDefinitionsList, footnotesDefinitionsList);
    // Phase 3: Replace all footnotes references and add matching definitions to the definitions list.
    for (const [footnoteId, msFootnoteRef] of msFootnotesRefs) {
        const msFootnoteDef = msFootnotesDefs.get(footnoteId);
        if (!msFootnoteDef) {
            continue;
        }
        // Replace footnote reference.
        writer.replace(msFootnoteRef, createFootnoteRefViewElement(writer, footnoteId));
        // Append found matching definition to the definitions list.
        // Order doesn't matter here, as it'll be fixed in the post-fixer.
        const defElements = createFootnoteDefViewElement(writer, footnoteId);
        removeMSReferences(writer, msFootnoteDef);
        // Insert content within the `MsoFootnoteText` element. It's usually a definition text content.
        for (const child of msFootnoteDef.getChildren()) {
            let clonedChild = child;
            if (child.is('element')) {
                clonedChild = writer.clone(child, true);
            }
            writer.appendChild(clonedChild, defElements.content);
        }
        writer.appendChild(defElements.listItem, footnotesDefinitionsList);
    }
}
/**
 * Removes all MS Office specific references from the given element.
 *
 * It also removes leading space from text nodes following the references, as MS Word adds
 * them to separate the reference from the rest of the text.
 *
 * @param writer The view writer.
 * @param element The element to trim.
 * @returns The trimmed element.
 */
function removeMSReferences(writer, element) {
    const elementsToRemove = [];
    const textNodesToTrim = [];
    for (const { item } of writer.createRangeIn(element)) {
        if (item.is('element') && item.getStyle('mso-footnote-id')) {
            elementsToRemove.unshift(item);
            // MS Word used to add spaces after footnote references within definitions. Let's check if there's a space after
            // the footnote reference and mark it for trimming.
            const { nextSibling } = item;
            if (nextSibling?.is('$text') && nextSibling.data.startsWith(' ')) {
                textNodesToTrim.unshift(nextSibling);
            }
        }
    }
    for (const element of elementsToRemove) {
        writer.remove(element);
    }
    // Remove only the leading space from text nodes following reference within definition, preserve the rest of the text.
    for (const textNode of textNodesToTrim) {
        const trimmedData = textNode.data.substring(1);
        if (trimmedData.length > 0) {
            // Create a new text node and replace the old one.
            const parent = textNode.parent;
            const index = parent.getChildIndex(textNode);
            const newTextNode = writer.createText(trimmedData);
            writer.remove(textNode);
            writer.insertChild(index, newTextNode, parent);
        }
        else {
            // If the text node contained only a space, remove it entirely.
            writer.remove(textNode);
        }
    }
    return element;
}
/**
 * Creates a footnotes list view element.
 *
 * @param writer The view writer instance.
 * @returns The footnotes list view element.
 */
function createFootnotesListViewElement(writer) {
    return writer.createElement('ol', { class: 'footnotes' });
}
/**
 * Creates a footnote reference view element.
 *
 * @param writer The view writer instance.
 * @param footnoteId The footnote ID.
 * @returns The footnote reference view element.
 */
function createFootnoteRefViewElement(writer, footnoteId) {
    const sup = writer.createElement('sup', { class: 'footnote' });
    const link = writer.createElement('a', {
        id: `ref-${footnoteId}`,
        href: `#${footnoteId}`,
    });
    writer.appendChild(link, sup);
    return sup;
}
/**
 * Creates a footnote definition view element with a backlink and a content container.
 *
 * @param writer The view writer instance.
 * @param footnoteId The footnote ID.
 * @returns An object containing the list item element, backlink and content container.
 */
function createFootnoteDefViewElement(writer, footnoteId) {
    const listItem = writer.createElement('li', {
        id: footnoteId,
        class: 'footnote-definition',
    });
    const backLink = writer.createElement('a', {
        href: `#ref-${footnoteId}`,
        class: 'footnote-backlink',
    });
    const content = writer.createElement('div', {
        class: 'footnote-content',
    });
    writer.appendChild(writer.createText('^'), backLink);
    writer.appendChild(backLink, listItem);
    writer.appendChild(content, listItem);
    return {
        listItem,
        content,
    };
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/normalizers/mswordnormalizer
 */
const msWordMatch1 = /<meta\s*name="?generator"?\s*content="?microsoft\s*word\s*\d+"?\/?>/i;
const msWordMatch2 = /xmlns:o="urn:schemas-microsoft-com/i;
/**
 * Normalizer for the content pasted from Microsoft Word.
 */
class PasteFromOfficeMSWordNormalizer {
    document;
    hasMultiLevelListPlugin;
    hasTablePropertiesPlugin;
    hasExtendedTableBlockAlignment;
    /**
     * Creates a new `PasteFromOfficeMSWordNormalizer` instance.
     *
     * @param document View document.
     */
    constructor(document, hasMultiLevelListPlugin = false, hasTablePropertiesPlugin = false, hasExtendedTableBlockAlignment = false) {
        this.document = document;
        this.hasMultiLevelListPlugin = hasMultiLevelListPlugin;
        this.hasTablePropertiesPlugin = hasTablePropertiesPlugin;
        this.hasExtendedTableBlockAlignment = hasExtendedTableBlockAlignment;
    }
    /**
     * @inheritDoc
     */
    isActive(htmlString) {
        return msWordMatch1.test(htmlString) || msWordMatch2.test(htmlString);
    }
    /**
     * @inheritDoc
     */
    execute(data) {
        const writer = new ViewUpcastWriter(this.document);
        const { body: documentFragment, stylesString } = data._parsedData;
        transformBookmarks(documentFragment, writer);
        // transformListItemLikeElementsIntoLists(documentFragment, stylesString, this.hasMultiLevelListPlugin);
        replaceImagesSourceWithBase64(documentFragment, data.dataTransfer.getData('text/rtf'));
        transformTables(documentFragment, writer, this.hasTablePropertiesPlugin, this.hasExtendedTableBlockAlignment);
        removeInvalidTableWidth(documentFragment, writer);
        replaceMSFootnotes(documentFragment, writer);
        removeMSAttributes(documentFragment);
        data.content = documentFragment;
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * Removes the `<b>` tag wrapper added by Google Docs to a copied content.
 *
 * @param documentFragment element `data.content` obtained from clipboard
 * @internal
 */
function removeBoldWrapper(documentFragment, writer) {
    for (const child of documentFragment.getChildren()) {
        if (child.is('element', 'b') && child.getStyle('font-weight') === 'normal') {
            const childIndex = documentFragment.getChildIndex(child);
            writer.remove(child);
            writer.insertChild(childIndex, child.getChildren(), documentFragment);
        }
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/filters/br
 */
/**
 * Transforms `<br>` elements that are siblings to some block element into a paragraphs.
 *
 * @param documentFragment The view structure to be transformed.
 * @internal
 */
function transformBlockBrsToParagraphs(documentFragment, writer) {
    const viewDocument = new ViewDocument(writer.document.stylesProcessor);
    const domConverter = new ViewDomConverter(viewDocument, { renderingMode: 'data' });
    const blockElements = domConverter.blockElements;
    const inlineObjectElements = domConverter.inlineObjectElements;
    const elementsToReplace = [];
    for (const value of writer.createRangeIn(documentFragment)) {
        const element = value.item;
        if (element.is('element', 'br')) {
            const nextSibling = findSibling(element, 'forward', writer, { blockElements, inlineObjectElements });
            const previousSibling = findSibling(element, 'backward', writer, { blockElements, inlineObjectElements });
            const nextSiblingIsBlock = isBlockViewElement(nextSibling, blockElements);
            const previousSiblingIsBlock = isBlockViewElement(previousSibling, blockElements);
            // If the <br> is surrounded by blocks then convert it to a paragraph:
            // * <p>foo</p>[<br>]<p>bar</p> -> <p>foo</p>[<p></p>]<p>bar</p>
            // * <p>foo</p>[<br>] -> <p>foo</p>[<p></p>]
            // * [<br>]<p>foo</p> -> [<p></p>]<p>foo</p>
            if (previousSiblingIsBlock || nextSiblingIsBlock) {
                elementsToReplace.push(element);
            }
        }
    }
    for (const element of elementsToReplace) {
        if (element.hasClass('Apple-interchange-newline')) {
            writer.remove(element);
        }
        else {
            writer.replace(element, writer.createElement('p'));
        }
    }
}
/**
 * Returns sibling node, threats inline elements as transparent (but should stop on an inline objects).
 */
function findSibling(viewElement, direction, writer, { blockElements, inlineObjectElements }) {
    let position = writer.createPositionAt(viewElement, direction == 'forward' ? 'after' : 'before');
    // Find first position that is just before a first:
    // * text node,
    // * block element,
    // * inline object element.
    // It's ignoring any inline (non-object) elements like span, strong, etc.
    position = position.getLastMatchingPosition(({ item }) => (item.is('element') &&
        !blockElements.includes(item.name) &&
        !inlineObjectElements.includes(item.name)), { direction });
    return direction == 'forward' ? position.nodeAfter : position.nodeBefore;
}
/**
 * Returns true for view elements that are listed as block view elements.
 */
function isBlockViewElement(node, blockElements) {
    return !!node && node.is('element') && blockElements.includes(node.name);
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/filters/list
 */
/**
 * Transforms Word specific list-like elements to the semantic HTML lists.
 *
 * Lists in Word are represented by block elements with special attributes like:
 *
 * ```xml
 * <p class=MsoListParagraphCxSpFirst style='mso-list:l1 level1 lfo1'>...</p> // Paragraph based list.
 * <h1 style='mso-list:l0 level1 lfo1'>...</h1> // Heading 1 based list.
 * ```
 *
 * @param documentFragment The view structure to be transformed.
 * @param stylesString Styles from which list-like elements styling will be extracted.
 * @internal
 */
function transformListItemLikeElementsIntoLists(documentFragment, stylesString, hasMultiLevelListPlugin) {
    if (!documentFragment.childCount) {
        return;
    }
    const writer = new ViewUpcastWriter(documentFragment.document);
    const itemLikeElements = findAllItemLikeElements(documentFragment, writer);
    if (!itemLikeElements.length) {
        return;
    }
    const encounteredLists = {};
    const stack = [];
    let topLevelListInfo = createTopLevelListInfo();
    for (const itemLikeElement of itemLikeElements) {
        if (itemLikeElement.indent !== undefined) {
            if (!isListContinuation(itemLikeElement)) {
                applyIndentationToTopLevelList(writer, stack, topLevelListInfo);
                topLevelListInfo = createTopLevelListInfo();
                stack.length = 0;
            }
            // Combined list ID for addressing encounter lists counters.
            const originalListId = `${itemLikeElement.id}:${itemLikeElement.indent}`;
            // Normalized list item indentation.
            const indent = Math.min(itemLikeElement.indent - 1, stack.length);
            // Trimming of the list stack on list ID change.
            if (indent < stack.length && stack[indent].id !== itemLikeElement.id) {
                stack.length = indent;
            }
            // Trimming of the list stack on lower indent list encountered.
            if (indent < stack.length - 1) {
                stack.length = indent + 1;
            }
            else {
                const listStyle = detectListStyle(itemLikeElement, stylesString);
                // Create a new OL/UL if required (greater indent or different list type).
                if (indent > stack.length - 1 || stack[indent].listElement.name != listStyle.type) {
                    // Check if there is some start index to set from a previous list.
                    if (indent == 0 && listStyle.type == 'ol' && itemLikeElement.id !== undefined && encounteredLists[originalListId]) {
                        listStyle.startIndex = encounteredLists[originalListId];
                    }
                    const listElement = createNewEmptyList(listStyle, writer, hasMultiLevelListPlugin);
                    // Insert the new OL/UL.
                    if (stack.length == 0) {
                        const parent = itemLikeElement.element.parent;
                        const index = parent.getChildIndex(itemLikeElement.element) + 1;
                        writer.insertChild(index, listElement, parent);
                    }
                    else {
                        const parentListItems = stack[indent - 1].listItemElements;
                        writer.appendChild(listElement, parentListItems[parentListItems.length - 1]);
                    }
                    // Update the list stack for other items to reference.
                    stack[indent] = {
                        ...itemLikeElement,
                        listElement,
                        listItemElements: [],
                    };
                    // Prepare list counter for start index.
                    if (indent == 0 && itemLikeElement.id !== undefined) {
                        encounteredLists[originalListId] = listStyle.startIndex || 1;
                    }
                }
            }
            // Use LI if it is already it or create a new LI element.
            // https://github.com/ckeditor/ckeditor5/issues/15964
            const listItem = itemLikeElement.element.name == 'li' ? itemLikeElement.element : writer.createElement('li');
            applyListItemMarginLeftAndUpdateTopLevelInfo(writer, stack, topLevelListInfo, itemLikeElement, listItem, indent);
            // Append the LI to OL/UL.
            writer.appendChild(listItem, stack[indent].listElement);
            stack[indent].listItemElements.push(listItem);
            // Increment list counter.
            if (indent == 0 && itemLikeElement.id !== undefined) {
                encounteredLists[originalListId]++;
            }
            // Append list block to LI.
            if (itemLikeElement.element != listItem) {
                writer.appendChild(itemLikeElement.element, listItem);
            }
            // Clean list block.
            removeBulletElement(itemLikeElement.element, writer);
            writer.removeStyle('text-indent', itemLikeElement.element); // #12361
            writer.removeStyle('margin-left', itemLikeElement.element);
        }
        else {
            // Other blocks in a list item.
            const stackItem = stack.find(stackItem => stackItem.marginLeft == itemLikeElement.marginLeft);
            // This might be a paragraph that has known margin, but it is not a real list block.
            if (stackItem) {
                const listItems = stackItem.listItemElements;
                // Append block to LI.
                writer.appendChild(itemLikeElement.element, listItems[listItems.length - 1]);
                writer.removeStyle('margin-left', itemLikeElement.element);
            }
            else {
                stack.length = 0;
            }
        }
    }
    applyIndentationToTopLevelList(writer, stack, topLevelListInfo);
}
function applyListItemMarginLeftAndUpdateTopLevelInfo(writer, stack, topLevelListInfo, itemLikeElement, listItem, indent) {
    if (itemLikeElement.marginLeft === undefined) {
        // If at least one of the list items at indent = 0 does not have margin-left style, we cannot set margin-left on the list.
        if (indent == 0) {
            topLevelListInfo.canApplyMarginOnList = false;
        }
        return;
    }
    const listItemBlockMarginLeft = parseFloat(itemLikeElement.marginLeft);
    let currentListBlockIndent = 0;
    if (stack.length > 1) {
        const prevStackLevelItems = stack[stack.length - 2].listItemElements;
        if (prevStackLevelItems.length > 0) {
            // The margin-left style of the previous indent level last item is already a relative value applied in the previous iteration.
            const lastItemMargin = prevStackLevelItems[prevStackLevelItems.length - 1].getStyle('margin-left');
            if (lastItemMargin !== undefined) {
                currentListBlockIndent += parseFloat(lastItemMargin);
            }
        }
    }
    // Add 40px for each indent level because by default HTML lists have 40px indentation (padding-inline-start: 40px).
    // So every nested list is indented by another 40px.
    // Additionally, the nested list itself may be placed in a list item with margin-left style.
    currentListBlockIndent += stack.length * 40;
    // Calculate relative list item indentation to the list it is in.
    const adjustedListItemIndent = listItemBlockMarginLeft - currentListBlockIndent;
    const listItemBlockMarginLeftPx = adjustedListItemIndent !== 0 ? toPx(adjustedListItemIndent) : undefined;
    if (listItemBlockMarginLeftPx) {
        writer.setStyle('margin-left', listItemBlockMarginLeftPx, listItem);
        if (indent == 0 && topLevelListInfo.canApplyMarginOnList) {
            if (topLevelListInfo.marginLeft === undefined) {
                topLevelListInfo.marginLeft = listItemBlockMarginLeftPx;
            }
            if (listItemBlockMarginLeftPx !== topLevelListInfo.marginLeft) {
                topLevelListInfo.canApplyMarginOnList = false;
            }
            topLevelListInfo.topLevelListItemElements.push(listItem);
        }
    }
}
function createTopLevelListInfo() {
    return {
        marginLeft: undefined,
        canApplyMarginOnList: true,
        topLevelListItemElements: [],
    };
}
/**
 * Sets margin-left style to the top-level list if all its items have the same margin-left.
 * If margin-left is set on the list, it is removed from all its items to avoid doubling of margins.
 */
function applyIndentationToTopLevelList(writer, stack, topLevelListInfo) {
    if (topLevelListInfo.canApplyMarginOnList && topLevelListInfo.marginLeft && topLevelListInfo.topLevelListItemElements.length > 0) {
        // Apply margin-left to the top-level list if all its items have the same margin-left.
        writer.setStyle('margin-left', topLevelListInfo.marginLeft, stack[0].listElement);
        // Remove margin-left from all top-level list items.
        for (const topLevelListItem of topLevelListInfo.topLevelListItemElements) {
            writer.removeStyle('margin-left', topLevelListItem);
        }
    }
}
/**
 * Removes paragraph wrapping content inside a list item.
 *
 * @internal
 */
function unwrapParagraphInListItem(documentFragment, writer) {
    for (const value of writer.createRangeIn(documentFragment)) {
        const element = value.item;
        if (element.is('element', 'li')) {
            // Google Docs allows for single paragraph inside LI.
            const firstChild = element.getChild(0);
            if (firstChild && firstChild.is('element', 'p')) {
                writer.unwrapElement(firstChild);
            }
        }
    }
}
/**
 * Finds all list-like elements in a given document fragment.
 *
 * @param documentFragment Document fragment in which to look for list-like nodes.
 * @returns Array of found list-like items. Each item is an object containing
 * @internal
 */
function findAllItemLikeElements(documentFragment, writer) {
    const range = writer.createRangeIn(documentFragment);
    const itemLikeElements = [];
    const foundMargins = new Set();
    for (const item of range.getItems()) {
        // https://github.com/ckeditor/ckeditor5/issues/15964
        if (!item.is('element') || !item.name.match(/^(p|h\d+|li|div)$/)) {
            continue;
        }
        // Try to rely on margin-left style to find paragraphs visually aligned with previously encountered list item.
        let marginLeft = getMarginLeftNormalized(item);
        // Ignore margin-left 0 style if there is no MsoList... class.
        if (marginLeft !== undefined &&
            parseFloat(marginLeft) == 0 &&
            !Array.from(item.getClassNames()).find(className => className.startsWith('MsoList'))) {
            marginLeft = undefined;
        }
        // List item or a following list item block.
        if ((item.hasStyle('mso-list') && item.getStyle('mso-list') !== 'none') || (marginLeft !== undefined && foundMargins.has(marginLeft))) {
            const itemData = getListItemData(item);
            itemLikeElements.push({
                element: item,
                id: itemData.id,
                order: itemData.order,
                indent: itemData.indent,
                marginLeft,
            });
            if (marginLeft !== undefined) {
                foundMargins.add(marginLeft);
            }
        }
        // Clear found margins as we found block after a list.
        else {
            foundMargins.clear();
        }
    }
    return itemLikeElements;
}
/**
 * Whether the given element is possibly a list continuation. Previous element was wrapped into a list
 * or the current element already is inside a list.
 */
function isListContinuation(currentItem) {
    const previousSibling = currentItem.element.previousSibling;
    if (!previousSibling) {
        const parent = currentItem.element.parent;
        // If it's a li inside ul or ol like in here: https://github.com/ckeditor/ckeditor5/issues/15964.
        // If the parent has previous sibling, which is not a list, then it is not a continuation.
        return isList(parent) && (!parent.previousSibling || isList(parent.previousSibling));
    }
    // Even with the same id the list does not have to be continuous (#43).
    return isList(previousSibling);
}
function isList(element) {
    return element.is('element', 'ol') || element.is('element', 'ul');
}
/**
 * Extracts list item style from the provided CSS.
 *
 * List item style is extracted from the CSS stylesheet. Each list with its specific style attribute
 * value (`mso-list:l1 level1 lfo1`) has its dedicated properties in a CSS stylesheet defined with a selector like:
 *
 * ```css
 * @list l1:level1 { ... }
 * ```
 *
 * It contains `mso-level-number-format` property which defines list numbering/bullet style. If this property
 * is not defined it means default `decimal` numbering.
 *
 * Here CSS string representation is used as `mso-level-number-format` property is an invalid CSS property
 * and will be removed during CSS parsing.
 *
 * @param listLikeItem List-like item for which list style will be searched for. Usually
 * a result of `findAllItemLikeElements()` function.
 * @param stylesString CSS stylesheet.
 * @returns An object with properties:
 *
 * * type - List type, could be `ul` or `ol`.
 * * startIndex - List start index, valid only for ordered lists.
 * * style - List style, for example: `decimal`, `lower-roman`, etc. It is extracted
 *     directly from Word stylesheet and adjusted to represent proper values for the CSS `list-style-type` property.
 *     If it cannot be adjusted, the `null` value is returned.
 */
function detectListStyle(listLikeItem, stylesString) {
    const listStyleRegexp = new RegExp(`@list l${listLikeItem.id}:level${listLikeItem.indent}\\s*({[^}]*)`, 'gi');
    const listStyleTypeRegex = /mso-level-number-format:([^;]{0,100});/gi;
    const listStartIndexRegex = /mso-level-start-at:\s{0,100}([0-9]{0,10})\s{0,100};/gi;
    const legalStyleListRegex = new RegExp(`@list\\s+l${listLikeItem.id}:level\\d\\s*{[^{]*mso-level-text:"%\\d\\\\.`, 'gi');
    const multiLevelNumberFormatTypeRegex = new RegExp(`@list l${listLikeItem.id}:level\\d\\s*{[^{]*mso-level-number-format:`, 'gi');
    const legalStyleListMatch = legalStyleListRegex.exec(stylesString);
    const multiLevelNumberFormatMatch = multiLevelNumberFormatTypeRegex.exec(stylesString);
    // Multi level lists in Word have mso-level-number-format attribute except legal lists,
    // so we used that. If list has legal list match and doesn't has mso-level-number-format
    // then this is legal-list.
    const islegalStyleList = legalStyleListMatch && !multiLevelNumberFormatMatch;
    const listStyleMatch = listStyleRegexp.exec(stylesString);
    let listStyleType = 'decimal'; // Decimal is default one.
    let type = 'ol'; // <ol> is default list.
    let startIndex = null;
    if (listStyleMatch && listStyleMatch[1]) {
        const listStyleTypeMatch = listStyleTypeRegex.exec(listStyleMatch[1]);
        if (listStyleTypeMatch && listStyleTypeMatch[1]) {
            listStyleType = listStyleTypeMatch[1].trim();
            type = listStyleType !== 'bullet' && listStyleType !== 'image' ? 'ol' : 'ul';
        }
        // Styles for the numbered lists are always defined in the Word CSS stylesheet.
        // Unordered lists MAY contain a value for the Word CSS definition `mso-level-text` but sometimes
        // this tag is missing. And because of that, we cannot depend on that. We need to predict the list style value
        // based on the list style marker element.
        if (listStyleType === 'bullet') {
            const bulletedStyle = findBulletedListStyle(listLikeItem.element);
            if (bulletedStyle) {
                listStyleType = bulletedStyle;
            }
        }
        else {
            const listStartIndexMatch = listStartIndexRegex.exec(listStyleMatch[1]);
            if (listStartIndexMatch && listStartIndexMatch[1]) {
                startIndex = parseInt(listStartIndexMatch[1]);
            }
        }
        if (islegalStyleList) {
            type = 'ol';
        }
    }
    return {
        type,
        startIndex,
        style: mapListStyleDefinition(listStyleType),
        isLegalStyleList: islegalStyleList,
    };
}
/**
 * Tries to extract the `list-style-type` value based on the marker element for bulleted list.
 */
function findBulletedListStyle(element) {
    // https://github.com/ckeditor/ckeditor5/issues/15964
    if (element.name == 'li' && element.parent.name == 'ul' && element.parent.hasAttribute('type')) {
        return element.parent.getAttribute('type');
    }
    const listMarkerElement = findListMarkerNode(element);
    if (!listMarkerElement) {
        return null;
    }
    const listMarker = listMarkerElement._data;
    if (listMarker === 'o') {
        return 'circle';
    }
    else if (listMarker === '·') {
        return 'disc';
    }
    // Word returns '§' instead of '■' for the square list style.
    else if (listMarker === '§') {
        return 'square';
    }
    return null;
}
/**
 * Tries to find a text node that represents the marker element (list-style-type).
 */
function findListMarkerNode(element) {
    // If the first child is a text node, it is the data for the element.
    // The list-style marker is not present here.
    if (element.getChild(0).is('$text')) {
        return null;
    }
    for (const childNode of element.getChildren()) {
        // The list-style marker will be inside the `<span>` element. Let's ignore all non-span elements.
        // It may happen that the `<a>` element is added as the first child. Most probably, it's an anchor element.
        if (!childNode.is('element', 'span')) {
            continue;
        }
        const textNodeOrElement = childNode.getChild(0);
        if (!textNodeOrElement) {
            continue;
        }
        // If already found the marker element, use it.
        if (textNodeOrElement.is('$text')) {
            return textNodeOrElement;
        }
        return textNodeOrElement.getChild(0);
    }
    /* istanbul ignore next -- @preserve */
    return null;
}
/**
 * Parses the `list-style-type` value extracted directly from the Word CSS stylesheet and returns proper CSS definition.
 */
function mapListStyleDefinition(value) {
    if (value.startsWith('arabic-leading-zero')) {
        return 'decimal-leading-zero';
    }
    switch (value) {
        case 'alpha-upper':
            return 'upper-alpha';
        case 'alpha-lower':
            return 'lower-alpha';
        case 'roman-upper':
            return 'upper-roman';
        case 'roman-lower':
            return 'lower-roman';
        case 'circle':
        case 'disc':
        case 'square':
            return value;
        default:
            return null;
    }
}
/**
 * Creates a new list OL/UL element.
 */
function createNewEmptyList(listStyle, writer, hasMultiLevelListPlugin) {
    const list = writer.createElement(listStyle.type);
    // We do not support modifying the marker for a particular list item.
    // Set the value for the `list-style-type` property directly to the list container.
    if (listStyle.style) {
        writer.setStyle('list-style-type', listStyle.style, list);
    }
    if (listStyle.startIndex && listStyle.startIndex > 1) {
        writer.setAttribute('start', listStyle.startIndex, list);
    }
    if (listStyle.isLegalStyleList && hasMultiLevelListPlugin) {
        writer.addClass('legal-list', list);
    }
    return list;
}
/**
 * Extracts list item information from Word specific list-like element style:
 *
 * ```
 * `style="mso-list:l1 level1 lfo1"`
 * ```
 *
 * where:
 *
 * ```
 * * `l1` is a list id (however it does not mean this is a continuous list - see #43),
 * * `level1` is a list item indentation level,
 * * `lfo1` is a list insertion order in a document.
 * ```
 *
 * @param element Element from which style data is extracted.
 */
function getListItemData(element) {
    const listStyle = element.getStyle('mso-list');
    if (listStyle === undefined) {
        return {};
    }
    const idMatch = listStyle.match(/(^|\s{1,100})l(\d+)/i);
    const orderMatch = listStyle.match(/\s{0,100}lfo(\d+)/i);
    const indentMatch = listStyle.match(/\s{0,100}level(\d+)/i);
    if (idMatch && orderMatch && indentMatch) {
        return {
            id: idMatch[2],
            order: orderMatch[1],
            indent: parseInt(indentMatch[1]),
        };
    }
    return {
        indent: 1, // Handle empty mso-list style as a marked for default list item.
    };
}
/**
 * Removes span with a numbering/bullet from a given element.
 */
function removeBulletElement(element, writer) {
    // Matcher for finding `span` elements holding lists numbering/bullets.
    const bulletMatcher = new Matcher({
        name: 'span',
        styles: {
            'mso-list': 'Ignore',
        },
    });
    const range = writer.createRangeIn(element);
    for (const value of range) {
        if (value.type === 'elementStart' && bulletMatcher.match(value.item)) {
            writer.remove(value.item);
        }
    }
}
/**
 * Returns element left margin normalized to 'px' if possible.
 */
function getMarginLeftNormalized(element) {
    const value = element.getStyle('margin-left');
    if (value === undefined || value.endsWith('px')) {
        return value;
    }
    return convertCssLengthToPx(value);
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/normalizers/googledocsnormalizer
 */
const googleDocsMatch = /id=("|')docs-internal-guid-[-0-9a-f]+("|')/i;
/**
 * Normalizer for the content pasted from Google Docs.
 *
 * @internal
 */
class GoogleDocsNormalizer {
    document;
    /**
     * Creates a new `GoogleDocsNormalizer` instance.
     *
     * @param document View document.
     */
    constructor(document) {
        this.document = document;
    }
    /**
     * @inheritDoc
     */
    isActive(htmlString) {
        return googleDocsMatch.test(htmlString);
    }
    /**
     * @inheritDoc
     */
    execute(data) {
        const writer = new ViewUpcastWriter(this.document);
        const { body: documentFragment } = data._parsedData;
        removeBoldWrapper(documentFragment, writer);
        unwrapParagraphInListItem(documentFragment, writer);
        transformBlockBrsToParagraphs(documentFragment, writer);
        // replaceTabsWithinPreWithSpaces( documentFragment, writer, 8 );
        data.content = documentFragment;
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * Removes the `xmlns` attribute from table pasted from Google Sheets.
 *
 * @param documentFragment element `data.content` obtained from clipboard
 * @internal
 */
function removeXmlns(documentFragment, writer) {
    for (const child of documentFragment.getChildren()) {
        if (child.is('element', 'table') && child.hasAttribute('xmlns')) {
            writer.removeAttribute('xmlns', child);
        }
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * Removes the `<google-sheets-html-origin>` tag wrapper added by Google Sheets to a copied content.
 *
 * @param documentFragment element `data.content` obtained from clipboard
 * @internal
 */
function removeGoogleSheetsTag(documentFragment, writer) {
    for (const child of documentFragment.getChildren()) {
        if (child.is('element', 'google-sheets-html-origin')) {
            const childIndex = documentFragment.getChildIndex(child);
            writer.remove(child);
            writer.insertChild(childIndex, child.getChildren(), documentFragment);
        }
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * Removes `<style>` block added by Google Sheets to a copied content.
 *
 * @param documentFragment element `data.content` obtained from clipboard
 * @internal
 */
function removeStyleBlock(documentFragment, writer) {
    for (const child of Array.from(documentFragment.getChildren())) {
        if (child.is('element', 'style')) {
            writer.remove(child);
        }
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/normalizers/googlesheetsnormalizer
 */
const googleSheetsMatch = /<google-sheets-html-origin/i;
/**
 * Normalizer for the content pasted from Google Sheets.
 *
 * @internal
 */
class GoogleSheetsNormalizer {
    document;
    /**
     * Creates a new `GoogleSheetsNormalizer` instance.
     *
     * @param document View document.
     */
    constructor(document) {
        this.document = document;
    }
    /**
     * @inheritDoc
     */
    isActive(htmlString) {
        return googleSheetsMatch.test(htmlString);
    }
    /**
     * @inheritDoc
     */
    execute(data) {
        const writer = new ViewUpcastWriter(this.document);
        const { body: documentFragment } = data._parsedData;
        removeGoogleSheetsTag(documentFragment, writer);
        removeXmlns(documentFragment, writer);
        removeInvalidTableWidth(documentFragment, writer);
        removeStyleBlock(documentFragment, writer);
        data.content = documentFragment;
    }
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/filters/space
 */
/**
 * Replaces last space preceding elements closing tag with `&nbsp;`. Such operation prevents spaces from being removed
 * during further DOM/View processing (see especially {@link module:engine/view/domconverter~ViewDomConverter#_processDomInlineNodes}).
 * This method also takes into account Word specific `<o:p></o:p>` empty tags.
 * Additionally multiline sequences of spaces and new lines between tags are removed (see #39 and #40).
 *
 * @param htmlString HTML string in which spacing should be normalized.
 * @returns Input HTML with spaces normalized.
 * @internal
 */
function normalizeSpacing(htmlString) {
    // Run normalizeSafariSpaceSpans() two times to cover nested spans.
    return (normalizeSafariSpaceSpans(normalizeSafariSpaceSpans(htmlString))
        // Remove all \r\n from "spacerun spans" so the last replace line doesn't strip all whitespaces.
        .replace(/(<span\s+style=['"]mso-spacerun:yes['"]>[^\S\r\n]*?)[\r\n]+([^\S\r\n]*<\/span>)/g, '$1$2')
        .replace(/<span\s+style=['"]mso-spacerun:yes['"]><\/span>/g, '')
        .replace(/(<span\s+style=['"]letter-spacing:[^'"]+?['"]>)[\r\n]+(<\/span>)/g, '$1 $2')
        .replace(/ <\//g, '\u00A0</')
        .replace(/ <o:p><\/o:p>/g, '\u00A0<o:p></o:p>')
        // Remove <o:p> block filler from empty paragraph. Safari uses \u00A0 instead of &nbsp;.
        .replace(/<o:p>(&nbsp;|\u00A0)<\/o:p>/g, '')
        // Remove all whitespaces when they contain any \r or \n.
        .replace(/>([^\S\r\n]*[\r\n]\s*)</g, '><'));
}
/**
 * Normalizes spacing in special Word `spacerun spans` (`<span style='mso-spacerun:yes'>\s+</span>`) by replacing
 * all spaces with `&nbsp; ` pairs. This prevents spaces from being removed during further DOM/View processing
 * (see especially {@link module:engine/view/domconverter~ViewDomConverter#_processDomInlineNodes}).
 *
 * @param htmlDocument Native `Document` object in which spacing should be normalized.
 * @internal
 */
function normalizeSpacerunSpans(htmlDocument) {
    htmlDocument.querySelectorAll('span[style*=spacerun]').forEach(el => {
        const htmlElement = el;
        const innerTextLength = htmlElement.innerText.length || 0;
        htmlElement.innerText = Array(innerTextLength + 1)
            .join('\u00A0 ')
            .substr(0, innerTextLength);
    });
}
/**
 * Normalizes specific spacing generated by Safari when content pasted from Word (`<span class="Apple-converted-space"> </span>`)
 * by replacing all spaces sequences longer than 1 space with `&nbsp; ` pairs. This prevents spaces from being removed during
 * further DOM/View processing (see especially {@link module:engine/view/domconverter~ViewDomConverter#_processDataFromDomText}).
 *
 * This function is similar to {@link module:clipboard/utils/normalizeclipboarddata normalizeClipboardData util} but uses
 * regular spaces / &nbsp; sequence for replacement.
 *
 * @param htmlString HTML string in which spacing should be normalized
 * @returns Input HTML with spaces normalized.
 * @internal
 */
function normalizeSafariSpaceSpans(htmlString) {
    return htmlString.replace(/<span(?: class="Apple-converted-space"|)>(\s+)<\/span>/g, (fullMatch, spaces) => {
        return spaces.length === 1
            ? ' '
            : Array(spaces.length + 1)
                .join('\u00A0 ')
                .substr(0, spaces.length);
    });
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/filters/parse
 */
/**
 * Parses the provided HTML extracting contents of `<body>` and `<style>` tags.
 *
 * @param htmlString HTML string to be parsed.
 */
function parsePasteOfficeHtml(htmlString, stylesProcessor) {
    const domParser = new DOMParser();
    // Remove Word specific "if comments" so content inside is not omitted by the parser.
    htmlString = htmlString.replace(/<!--\[if gte vml 1]>/g, '');
    // Clean the <head> section of MS Windows specific tags. See https://github.com/ckeditor/ckeditor5/issues/15333.
    // The regular expression matches the <o:SmartTagType> tag with optional attributes (with or without values).
    htmlString = htmlString.replace(/<o:SmartTagType(?:\s+[^\s>=]+(?:="[^"]*")?)*\s*\/?>/gi, '');
    const normalizedHtml = normalizeSpacing(cleanContentAfterBody(htmlString));
    // Parse htmlString as native Document object.
    const htmlDocument = domParser.parseFromString(normalizedHtml, 'text/html');
    normalizeSpacerunSpans(htmlDocument);
    // Get `innerHTML` first as transforming to View modifies the source document.
    const bodyString = htmlDocument.body.innerHTML;
    // Transform document.body to View.
    const bodyView = documentToView(htmlDocument, stylesProcessor);
    // Extract stylesheets.
    const stylesObject = extractStyles(htmlDocument);
    return {
        body: bodyView,
        bodyString,
        styles: stylesObject.styles,
        stylesString: stylesObject.stylesString,
    };
}
/**
 * Transforms native `Document` object into {@link module:engine/view/documentfragment~ViewDocumentFragment}. Comments are skipped.
 *
 * @param htmlDocument Native `Document` object to be transformed.
 */
function documentToView(htmlDocument, stylesProcessor) {
    const viewDocument = new ViewDocument(stylesProcessor);
    const domConverter = new ViewDomConverter(viewDocument, { renderingMode: 'data' });
    const fragment = htmlDocument.createDocumentFragment();
    const nodes = htmlDocument.body.childNodes;
    while (nodes.length > 0) {
        fragment.appendChild(nodes[0]);
    }
    return domConverter.domToView(fragment, { skipComments: true });
}
/**
 * Extracts both `CSSStyleSheet` and string representation from all `style` elements available in a provided `htmlDocument`.
 *
 * @param htmlDocument Native `Document` object from which styles will be extracted.
 */
function extractStyles(htmlDocument) {
    const styles = [];
    const stylesString = [];
    const styleTags = Array.from(htmlDocument.getElementsByTagName('style'));
    for (const style of styleTags) {
        if (style.sheet && style.sheet.cssRules && style.sheet.cssRules.length) {
            styles.push(style.sheet);
            stylesString.push(style.innerHTML);
        }
    }
    return {
        styles,
        stylesString: stylesString.join(' '),
    };
}
/**
 * Removes leftover content from between closing </body> and closing </html> tag:
 *
 * ```html
 * <html><body><p>Foo Bar</p></body><span>Fo</span></html> -> <html><body><p>Foo Bar</p></body></html>
 * ```
 *
 * This function is used as specific browsers (Edge) add some random content after `body` tag when pasting from Word.
 * @param htmlString The HTML string to be cleaned.
 * @returns The HTML string with leftover content removed.
 */
function cleanContentAfterBody(htmlString) {
    const bodyCloseTag = '</body>';
    const htmlCloseTag = '</html>';
    const bodyCloseIndex = htmlString.indexOf(bodyCloseTag);
    if (bodyCloseIndex < 0) {
        return htmlString;
    }
    const htmlCloseIndex = htmlString.indexOf(htmlCloseTag, bodyCloseIndex + bodyCloseTag.length);
    return htmlString.substring(0, bodyCloseIndex + bodyCloseTag.length) + (htmlCloseIndex >= 0 ? htmlString.substring(htmlCloseIndex) : '');
}

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */
/**
 * @module paste-from-office/pastefromoffice
 */
/**
 * The Paste from Office plugin.
 *
 * This plugin handles content pasted from Office apps and transforms it (if necessary)
 * to a valid structure which can then be understood by the editor features.
 *
 * Transformation is made by a set of predefined {@link module:paste-from-office/normalizer~PasteFromOfficeNormalizer normalizers}.
 * This plugin includes following normalizers:
 * * {@link module:paste-from-office/normalizers/mswordnormalizer~PasteFromOfficeMSWordNormalizer Microsoft Word normalizer}
 * * {@link module:paste-from-office/normalizers/googledocsnormalizer~GoogleDocsNormalizer Google Docs normalizer}
 *
 * For more information about this feature check the {@glink api/paste-from-office package page}.
 */
class PasteHandler extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'PasteHandler';
    }
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ClipboardPipeline];
    }
    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const clipboardPipeline = editor.plugins.get('ClipboardPipeline');
        const viewDocument = editor.editing.view.document;
        const normalizers = [];
        const hasMultiLevelListPlugin = this.editor.plugins.has('MultiLevelListEditing');
        const hasTablePropertiesPlugin = this.editor.plugins.has('TablePropertiesEditing');
        const hasExtendedTableBlockAlignment = true; // In CKEditor 5 v48, extended table block alignment is stable and enabled by default.
        normalizers.push(new PasteFromOfficeMSWordNormalizer(viewDocument, hasMultiLevelListPlugin, hasTablePropertiesPlugin, hasExtendedTableBlockAlignment));
        normalizers.push(new GoogleDocsNormalizer(viewDocument));
        normalizers.push(new GoogleSheetsNormalizer(viewDocument));
        clipboardPipeline.on('inputTransformation', (evt, data) => {
            if (data._isTransformedWithPasteFromOffice) {
                return;
            }
            const codeBlock = editor.model.document.selection.getFirstPosition().parent;
            if (codeBlock.is('element', 'codeBlock')) {
                return;
            }
            const htmlString = data.dataTransfer.getData('text/html');
            const activeNormalizer = normalizers.find(normalizer => normalizer.isActive(htmlString));
            if (activeNormalizer) {
                if (!data._parsedData) {
                    data._parsedData = parsePasteOfficeHtml(htmlString, viewDocument.stylesProcessor);
                }
                activeNormalizer.execute(data);
                data._isTransformedWithPasteFromOffice = true;
            }
        }, { priority: 'high' });
    }
}

class HighlightRangePlugin extends Plugin {
    init() {
        const editor = this.editor;
        editor.conversion.for('editingDowncast').markerToHighlight({
            model: 'highlightRange',
            view: {
                classes: 'highlight-range',
            },
        });
    }
}

/**
 * Plugin để thêm margin-bottom: 4px cho các block elements
 * (paragraph, heading, list, table) thông qua downcast conversion
 */
class BlockSpace extends Plugin {
    static get pluginName() {
        return 'BlockSpace';
    }
    init() {
        const editor = this.editor;
        const conversion = editor.conversion;
        // Handler factory để áp dụng margin-bottom: 4px
        const makeHandler = (elementType) => {
            return (evt, data, conversionApi) => {
                const viewElement = conversionApi.mapper.toViewElement(data.item);
                if (viewElement) {
                    conversionApi.writer.setStyle('margin-top', '0', viewElement);
                    conversionApi.writer.setStyle('margin-bottom', '6pt', viewElement);
                    conversionApi.writer.setStyle('padding-top', '0', viewElement);
                    conversionApi.writer.setStyle('padding-bottom', '0', viewElement);
                    conversionApi.writer.setStyle('line-height', '1.15', viewElement);
                }
            };
        };
        // Áp dụng margin-bottom cho tất cả block elements
        conversion.for('downcast').add(dispatcher => {
            // Paragraph
            dispatcher.on('insert:paragraph', makeHandler('paragraph'), { priority: 'low' });
            // Heading (h1-h6)
            ['heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6'].forEach(heading => {
                dispatcher.on(`insert:${heading}`, makeHandler(heading), { priority: 'low' });
            });
            // Table
            dispatcher.on('insert:table', makeHandler('table'), { priority: 'low' });
            // PageBreak - add page-break-before style
            dispatcher.on('insert:pageBreak', (evt, data, conversionApi) => {
                const viewElement = conversionApi.mapper.toViewElement(data.item);
                if (viewElement) {
                    conversionApi.writer.setStyle('page-break-before', 'always', viewElement);
                }
            }, { priority: 'low' });
        });
    }
}

var _a;
class CkCommentPlugin extends Plugin {
    static get pluginName() {
        return 'CkComment';
    }
    static get requires() {
        return [ContextualBalloon];
    }
    #comments = new Map();
    // i18n đọc từ editor.config — plugin không có DI nên dùng pattern này; fallback giữ VI để consumer chưa setup vẫn chạy
    #getI18n() {
        return this.editor.config.get('_i18n');
    }
    #selectedId = null;
    #pendingId = null; // ID cho pending highlight
    #isCreatingPending = false; // Flag để prevent clearing pending khi đang tạo
    #isProcessingClick = false; // Flag để prevent duplicate click events
    #balloon;
    #config = {};
    // Hằng số ID cho pending marker
    static PENDING_MARKER_ID = '__pending_comment__';
    // Số node tìm kiếm mặc định khi path không chính xác
    static DEFAULT_SEARCH_RANGE = 5;
    // Độ dài text tối đa để tạo marker
    static DEFAULT_MAX_TEXT_LENGTH = 1000;
    // Màu sắc mặc định cho markers
    static DEFAULT_COLORS = {
        marker: 'rgba(59, 130, 246, 0.2)',
        markerSelected: 'rgba(59, 130, 246, 0.5)',
        markerPending: 'rgba(245, 158, 11, 0.4)',
        markerModified: 'rgba(255, 193, 7, 0.4)',
    };
    /**
     * Debug log - chỉ log khi debug config là true
     */
    #log(...args) {
        if (this.#config.debug) {
            console.log('[CkCommentPlugin]', ...args);
        }
    }
    /**
     * Debug warn - chỉ warn khi debug config là true
     */
    #warn(...args) {
        if (this.#config.debug) {
            console.warn('[CkCommentPlugin]', ...args);
        }
    }
    /**
     * Lấy màu sắc đã merge với default
     */
    #getColors() {
        return { ..._a.DEFAULT_COLORS, ...this.#config.colors };
    }
    init() {
        const editor = this.editor;
        this.#balloon = editor.plugins.get(ContextualBalloon);
        this.#log('init() called');
        // Thiết lập marker to highlight conversion
        this.#setupMarkerConversion();
        // Thiết lập click handler cho markers
        this.#setupMarkerClickHandler();
        // Thiết lập toolbar button
        this.#setupToolbarButton();
        // Thiết lập ContextualBalloon cho text selection (tùy chọn)
        this.#setupContextualBalloon();
        // Theo dõi thay đổi nội dung để cập nhật trạng thái comment
        this.#setupChangeTracking();
    }
    // ========================================================================
    // TOOLBAR BUTTON
    // ========================================================================
    #setupToolbarButton() {
        const editor = this.editor;
        editor.ui.componentFactory.add('ckCommentBtn', locale => {
            const view = new ButtonView(locale);
            const i18n = this.#getI18n();
            view.set({
                label: i18n?.t('core.component.document-builder.ck-comment.label') ?? '',
                icon: '<svg width="16px" height="16px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6l-4-4H4a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v9zM5 7h10v2H5V7zm0 4h10v2H5v-2z"/></svg>',
                tooltip: true,
                isEnabled: false,
            });
            // Enable khi có selection, không phải chỉ khoảng trắng, và allowCreating = true
            const selection = editor.model.document.selection;
            this.listenTo(selection, 'change', () => {
                // Disabled ngay khi allowCreating = false
                if (!(this.#config.allowCreating ?? true)) {
                    view.isEnabled = false;
                    return;
                }
                const isCollapsed = selection.isCollapsed;
                const range = selection.getFirstRange();
                // Kiểm tra xem selection có content không phải khoảng trắng không
                let hasValidContent = false;
                if (range && !isCollapsed) {
                    const text = this.#getTextFromRange(range);
                    const trimmedText = text.trim();
                    const maxTextLength = this.#config.maxTextLength ?? _a.DEFAULT_MAX_TEXT_LENGTH;
                    // Kiểm tra: có content, không phải chỉ khoảng trắng, và không vượt quá max length
                    hasValidContent = trimmedText.length > 0 && trimmedText.length <= maxTextLength;
                    if (trimmedText.length > maxTextLength) {
                        // @i18n-ignore — dev-only debug log, không hiển thị cho người dùng
                        this.#log(`Độ dài text vượt quá giới hạn: ${trimmedText.length} > ${maxTextLength}`);
                    }
                }
                view.isEnabled = hasValidContent;
            });
            // Xử lý khi click button
            this.listenTo(view, 'execute', () => {
                this.#log('Toolbar button clicked');
                const selectionData = this.#getSelectionData();
                if (selectionData) {
                    // Set flag để prevent clearing pending khi selection change
                    this.#isCreatingPending = true;
                    this.#log('Calling onPendingComment callback');
                    this.#config.onPendingComment?.({
                        id: '',
                        startPath: selectionData.startPath,
                        endPath: selectionData.endPath,
                        originalText: selectionData.text,
                        currentText: selectionData.text,
                        status: 'normal',
                    });
                    // Reset flag sau một khoảng ngắn để cho phép clear nếu selection thực sự thay đổi
                    setTimeout(() => {
                        this.#isCreatingPending = false;
                    }, 100);
                }
            });
            return view;
        });
    }
    // ========================================================================
    // MARKER CONVERSION
    // ========================================================================
    #setupMarkerConversion() {
        const self = this;
        this.editor.conversion.for('editingDowncast').markerToHighlight({
            model: 'comment',
            view: (data) => {
                const markerName = data.markerName;
                const commentId = markerName.replace('comment:', '');
                const classes = ['ck-comment-marker'];
                const colors = self.#getColors();
                // Kiểm tra xem có phải pending marker không
                if (commentId === _a.PENDING_MARKER_ID) {
                    classes.push('ck-comment-pending');
                    return {
                        classes: classes,
                        attributes: {
                            'data-comment-id': commentId,
                            style: `--comment-pending-bg: ${colors.markerPending}`,
                        },
                    };
                }
                const comment = self.#comments.get(commentId);
                // Build CSS variables based on status - ALWAYS set the correct variable for the status
                let cssVars = [];
                if (comment) {
                    // Add status class
                    classes.push(`ck-comment-${comment.status}`);
                    // Set CSS variable based on status
                    if (comment.status === 'modified') {
                        cssVars = [`--comment-modified-bg: ${colors.markerModified}`];
                    }
                    else if (comment.status === 'broken') {
                        cssVars = [`--comment-broken-bg: ${colors.markerBroken}`];
                    }
                    else {
                        // normal status
                        cssVars = [`--comment-bg: ${colors.marker}`];
                    }
                    // Add selected state if needed
                    if (commentId === self.#selectedId) {
                        classes.push('ck-comment-selected');
                        cssVars.push(`--comment-selected-bg: ${colors.markerSelected}`);
                    }
                }
                else {
                    // No comment found - use default
                    cssVars = [`--comment-bg: ${colors.marker}`];
                }
                return {
                    classes: classes,
                    attributes: {
                        'data-comment-id': commentId,
                        style: cssVars.join('; '),
                    },
                };
            },
        });
    }
    // ========================================================================
    // CLICK HANDLER
    // ========================================================================
    #setupMarkerClickHandler() {
        const viewDocument = this.editor.editing.view.document;
        // Lắng nghe cả click và mousedown trên CKEditor view
        viewDocument.on('mousedown', (evt, data) => {
            this.#log('Mousedown event triggered, data:', data);
            this.#handleMarkerClick(evt, data);
        });
        viewDocument.on('click', (evt, data) => {
            this.#log('Click event triggered, data:', data);
            this.#handleMarkerClick(evt, data);
        });
        // Thêm DOM event listener như fallback để đảm bảo bắt được click
        // Sử dụng editor's editable DOM element
        const editableElement = this.editor.ui.getEditableElement();
        if (editableElement) {
            editableElement.addEventListener('click', (domEvent) => {
                this.#log('DOM click event triggered');
                this.#handleDomMarkerClick(domEvent, editableElement);
            });
        }
    }
    /**
     * Handle DOM click event (fallback)
     */
    #handleDomMarkerClick(domEvent, rootElement) {
        // Prevent duplicate if already processing
        if (this.#isProcessingClick) {
            this.#log('DOM click skipped - already processing');
            return;
        }
        let targetElement = domEvent.target;
        // Traverse up to find marker element
        while (targetElement && targetElement !== rootElement) {
            if (targetElement.classList?.contains('ck-comment-marker')) {
                const commentId = targetElement.getAttribute('data-comment-id');
                this.#log('DOM click found marker with commentId:', commentId);
                if (commentId) {
                    this.#isProcessingClick = true;
                    this.selectComment(commentId, false);
                    domEvent.stopPropagation();
                    domEvent.preventDefault();
                    // Reset flag after a short delay
                    setTimeout(() => {
                        this.#isProcessingClick = false;
                    }, 50);
                }
                return;
            }
            targetElement = targetElement.parentElement;
        }
        // Click outside markers - clear selection
        if (this.#selectedId) {
            this.#log('DOM click outside markers, clearing selection');
            this.#selectedId = null;
            this.#refreshView();
        }
    }
    #handleMarkerClick(evt, data) {
        // Prevent duplicate if already processing
        if (this.#isProcessingClick) {
            this.#log('View click skipped - already processing');
            return;
        }
        const viewElement = data.target;
        let element = viewElement;
        this.#log('Target element:', element, 'hasClass:', typeof element?.hasClass);
        // Duyệt lên cây để tìm comment marker
        while (element) {
            const hasMarkerClass = element.hasClass?.('ck-comment-marker');
            this.#log('Checking element, hasMarkerClass:', hasMarkerClass);
            if (hasMarkerClass) {
                const commentId = element.getAttribute('data-comment-id');
                this.#log('Found marker with commentId:', commentId);
                this.#isProcessingClick = true;
                this.selectComment(commentId, false);
                evt.stop();
                // Reset flag after a short delay
                setTimeout(() => {
                    this.#isProcessingClick = false;
                }, 50);
                return;
            }
            element = element.parent;
        }
        // Click ngoài markers - xóa selection
        if (this.#selectedId) {
            this.#log('Click outside markers, clearing selection');
            this.#selectedId = null;
            this.#refreshView();
        }
    }
    // ========================================================================
    // CONTEXTUAL BALLOON
    // ========================================================================
    #setupContextualBalloon() {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        this.#log('#setupContextualBalloon initialized');
        // Lắng nghe selection changes
        this.listenTo(selection, 'change:range', () => {
            this.#log('Selection change:range, isCollapsed:', selection.isCollapsed);
            // Xóa pending nếu selection thay đổi sang text khác
            // NHƯNG không xóa nếu đang trong quá trình tạo pending
            if (this.#pendingId && !this.#isCreatingPending) {
                this.#log('Selection changed, clearing pending');
                this.clearPendingSelection();
            }
            else if (this.#isCreatingPending) {
                this.#log('Skipping clear pending - isCreatingPending flag is set');
            }
            if (!selection.isCollapsed) {
                // Chỉ hiện balloon khi allowCreating = true (mặc định)
                if (!(this.#config.allowCreating ?? true)) {
                    this.#hideBalloon();
                    return;
                }
                const range = selection.getFirstRange();
                if (range) {
                    // Chỉ hiện balloon khi selection có content không phải khoảng trắng và không vượt quá max length
                    const text = this.#getTextFromRange(range);
                    const trimmedText = text.trim();
                    const maxTextLength = this.#config.maxTextLength ?? _a.DEFAULT_MAX_TEXT_LENGTH;
                    if (trimmedText.length > 0 && trimmedText.length <= maxTextLength) {
                        this.#showBalloon(range);
                    }
                    else {
                        this.#hideBalloon();
                    }
                }
            }
            else {
                this.#hideBalloon();
            }
        });
        // Ẩn balloon khi focus thay đổi
        this.listenTo(editor.ui, 'update', () => {
            if (selection.isCollapsed) {
                this.#hideBalloon();
            }
        });
    }
    #showBalloon(range) {
        this.#log('#showBalloon called, range:', range);
        const editor = this.editor;
        // Ẩn balloon hiện tại trước
        this.#hideBalloon();
        // Tạo balloon button
        const buttonView = new ButtonView(editor.locale);
        const balloonI18n = this.#getI18n();
        buttonView.set({
            label: balloonI18n?.t('core.component.document-builder.ck-comment.label') ?? '',
            icon: '<svg width="16px" height="16px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6l-4-4H4a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v9zM5 7h10v2H5V7zm0 4h10v2H5v-2z"/></svg>',
            tooltip: true,
            withText: true,
        });
        // Xử lý khi click button
        this.listenTo(buttonView, 'execute', () => {
            this.#log('Balloon button clicked');
            const selection = this.#getSelectionData();
            this.#log('Selection data:', selection);
            if (selection) {
                // Set flag để prevent clearing pending khi selection change
                this.#isCreatingPending = true;
                this.#log('Calling onPendingComment callback');
                this.#config.onPendingComment?.({
                    id: '',
                    startPath: selection.startPath,
                    endPath: selection.endPath,
                    originalText: selection.text,
                    currentText: selection.text,
                    status: 'normal',
                });
                // Reset flag sau một khoảng ngắn
                setTimeout(() => {
                    this.#isCreatingPending = false;
                }, 100);
            }
            this.#hideBalloon();
        });
        // Thêm vào balloon
        try {
            this.#balloon.add({
                view: buttonView,
                position: {
                    target: () => {
                        const viewRange = editor.editing.mapper.toViewRange(range);
                        return editor.editing.view.domConverter.viewRangeToDom(viewRange);
                    },
                },
            });
            this.#balloonView = buttonView;
            this.#log('Balloon added successfully');
        }
        catch (e) {
            this.#warn('Error adding balloon:', e);
        }
    }
    #balloonView = null;
    #hideBalloon() {
        if (this.#balloonView) {
            this.#balloon.remove(this.#balloonView);
            this.#balloonView = null;
        }
    }
    // ========================================================================
    // CHANGE TRACKING
    // ========================================================================
    #setupChangeTracking() {
        const editor = this.editor;
        // Lắng nghe thay đổi dữ liệu
        editor.model.document.on('change:data', () => {
            this.#updateCommentStatuses();
        });
        // Lắng nghe thay đổi marker
        editor.model.document.on('change:markers', () => {
            this.#updateCommentStatuses();
        });
    }
    #updateCommentStatuses() {
        let hasChanges = false;
        this.#comments.forEach((comment, id) => {
            const marker = this.editor.model.markers.get(`comment:${id}`);
            if (marker) {
                const range = marker.getRange();
                const currentText = this.#getTextFromRange(range);
                // Tự động cập nhật paths (CKEditor duy trì chúng)
                const newStartPath = Array.from(range.start.path);
                const newEndPath = Array.from(range.end.path);
                const pathChanged = JSON.stringify(comment.startPath) !== JSON.stringify(newStartPath) ||
                    JSON.stringify(comment.endPath) !== JSON.stringify(newEndPath);
                const textChanged = currentText !== comment.currentText;
                if (pathChanged || textChanged) {
                    const oldStatus = comment.status;
                    hasChanges = true;
                    comment.startPath = newStartPath;
                    comment.endPath = newEndPath;
                    comment.currentText = currentText;
                    // Cập nhật trạng thái
                    if (currentText === comment.originalText) {
                        comment.status = 'normal';
                    }
                    else if (currentText.length === 0) {
                        comment.status = 'broken';
                    }
                    else {
                        comment.status = 'modified';
                    }
                    this.#log(`Comment ${id} status changed: ${oldStatus} -> ${comment.status}`, `\n  originalText: "${comment.originalText}"`, `\n  currentText: "${currentText}"`, `\n  textChanged: ${textChanged}`);
                }
            }
            else {
                // Không tìm thấy marker - bị hỏng
                if (comment.status !== 'broken') {
                    const oldStatus = comment.status;
                    hasChanges = true;
                    comment.status = 'broken';
                    this.#log(`Comment ${id} marker not found, status changed: ${oldStatus} -> broken`);
                }
            }
        });
        if (hasChanges) {
            this.#refreshView();
            this.#fireOnChange();
        }
    }
    // ========================================================================
    // PUBLIC API
    // ========================================================================
    /**
     * Thiết lập config với callbacks
     */
    setConfig(config) {
        this.#config = config;
    }
    /**
     * Thêm comment và tạo marker
     */
    addComment(comment) {
        if (this.#comments.has(comment.id)) {
            this.#warn(`Comment with id ${comment.id} already exists`);
            return false;
        }
        // Tạo marker
        const success = this.#createMarker(comment);
        // Lưu comment (với trạng thái broken nếu marker thất bại)
        const storedComment = success ? { ...comment } : { ...comment, status: 'broken' };
        this.#comments.set(comment.id, storedComment);
        this.#refreshView();
        this.#fireOnChange();
        // Chỉ fire onAddComment callback KHI thêm thành công (không phải broken)
        if (success) {
            this.#config.onAddComment?.(storedComment);
        }
        return true;
    }
    /**
     * Xóa comment theo id
     */
    removeComment(id) {
        const comment = this.#comments.get(id);
        if (!comment) {
            return false;
        }
        // Xóa marker
        this.editor.model.change(writer => {
            writer.removeMarker(`comment:${id}`);
        });
        // Xóa khỏi map
        this.#comments.delete(id);
        // Xóa selection nếu bị xóa
        if (this.#selectedId === id) {
            this.#selectedId = null;
        }
        this.#refreshView();
        this.#fireOnChange();
        return true;
    }
    /**
     * Chọn comment theo id - chỉ thêm class highlight, không bôi đen text
     */
    selectComment(id, scrollIntoView = true) {
        this.#log('selectComment called with id:', id, 'hasComment:', this.#comments.has(id));
        if (!this.#comments.has(id)) {
            this.#warn('Comment not found:', id);
            return;
        }
        this.#selectedId = id;
        this.#refreshView();
        if (scrollIntoView) {
            this.#scrollToComment(id);
        }
        this.#log('Firing onSelectComment callback for id:', id);
        this.#config.onSelectComment?.(id);
    }
    /**
     * Thiết lập tất cả comments (khôi phục từ dữ liệu)
     */
    setComments(comments) {
        this.#log('setComments called with', comments.length, 'comments');
        // Xóa comments hiện tại
        this.#log('Clearing existing comments, count:', this.#comments.size);
        this.#comments.forEach((_, id) => {
            const markerName = `comment:${id}`;
            if (this.editor.model.markers.has(markerName)) {
                this.#log('Removing marker:', markerName);
                this.editor.model.change(writer => {
                    writer.removeMarker(markerName);
                });
            }
            else {
                this.#warn('Marker not found, skipping:', markerName);
            }
        });
        this.#comments.clear();
        this.#selectedId = null;
        // Thêm comments mới - status sẽ được tính toán động từ editor
        comments.forEach(comment => {
            const success = this.#createMarker(comment);
            // Lưu comment với status mặc định, sẽ được cập nhật bởi #updateCommentStatuses
            const storedComment = {
                ...comment,
                status: success ? 'normal' : 'broken',
                currentText: success ? comment.originalText : '',
            };
            this.#comments.set(comment.id, storedComment);
        });
        this.#refreshView();
        this.#fireOnChange();
    }
    /**
     * Lấy tất cả comments
     */
    get comments() {
        return Array.from(this.#comments.values());
    }
    /**
     * Thiết lập pending highlight cho selection (khi user đang nhập nội dung comment)
     */
    setPendingSelection(startPath, endPath) {
        // Xóa pending marker hiện tại MÀ KHÔNG fire callback
        this.#clearPendingMarker();
        const model = this.editor.model;
        try {
            model.change(writer => {
                const root = model.document.getRoot();
                if (!root) {
                    throw new Error('Document root not found');
                }
                const startPos = writer.createPositionFromPath(root, startPath);
                const endPos = writer.createPositionFromPath(root, endPath);
                const range = writer.createRange(startPos, endPos);
                writer.addMarker(`comment:${_a.PENDING_MARKER_ID}`, {
                    range,
                    usingOperation: false,
                    affectsData: false,
                });
            });
            this.#pendingId = _a.PENDING_MARKER_ID;
            this.#refreshView();
            return true;
        }
        catch (e) {
            this.#warn('Failed to set pending selection:', e);
            return false;
        }
    }
    /**
     * Xóa pending marker mà không fire callback (dùng nội bộ)
     */
    #clearPendingMarker() {
        if (!this.#pendingId)
            return;
        this.editor.model.change(writer => {
            writer.removeMarker(`comment:${_a.PENDING_MARKER_ID}`);
        });
        this.#pendingId = null;
        this.#refreshView();
    }
    /**
     * Xóa pending highlight và fire onCancelPending callback
     */
    clearPendingSelection() {
        if (!this.#pendingId)
            return;
        this.#clearPendingMarker();
        // Fire callback để thông báo UI
        this.#config.onCancelPending?.();
    }
    /**
     * Lấy dữ liệu selection hiện tại để tạo comment
     * Trim khoảng trắng để tránh sai vị trí khi lưu
     */
    #getSelectionData() {
        const selection = this.editor.model.document.selection;
        const range = selection.getFirstRange();
        if (!range || range.isCollapsed) {
            return null;
        }
        // Validate: start/end không được nằm bên trong isObject element (path.length > 2)
        // Trường hợp xảy ra khi user drag-select qua bound variable widget
        if (range.start.path.length > 2 || range.end.path.length > 2) {
            this.#warn('Selection contains invalid path (inside isObject element) - aborting comment creation', {
                startPath: Array.from(range.start.path),
                endPath: Array.from(range.end.path),
            });
            return null;
        }
        const text = this.#getTextFromRange(range);
        const trimmedText = text.trim();
        if (!trimmedText) {
            return null;
        }
        // Kiểm tra độ dài text tối đa
        const maxTextLength = this.#config.maxTextLength ?? _a.DEFAULT_MAX_TEXT_LENGTH;
        if (trimmedText.length > maxTextLength) {
            this.#warn(`Text too long: ${trimmedText.length} > ${maxTextLength}`);
            // Fire error callback
            const errorI18n = this.#getI18n();
            this.#config.onError?.({
                code: 'TEXT_TOO_LONG',
                message: errorI18n?.t('core.component.document-builder.ck-comment.text-too-long', { length: trimmedText.length, max: maxTextLength }) ?? '',
                data: { textLength: trimmedText.length, maxLength: maxTextLength },
            });
            return null;
        }
        // Tính toán số ký tự cần trim ở đầu và cuối
        const leadingWhitespace = text.length - text.trimStart().length;
        const trailingWhitespace = text.length - text.trimEnd().length;
        // Điều chỉnh range để loại bỏ khoảng trắng
        let adjustedRange = range;
        if (leadingWhitespace > 0 || trailingWhitespace > 0) {
            adjustedRange = this.#adjustRangeForTrim(range, leadingWhitespace, trailingWhitespace);
        }
        // Validate lại sau khi trim
        if (adjustedRange.start.path.length > 2 || adjustedRange.end.path.length > 2) {
            this.#warn('Adjusted range has invalid path depth - aborting');
            return null;
        }
        return {
            range: adjustedRange,
            startPath: Array.from(adjustedRange.start.path),
            endPath: Array.from(adjustedRange.end.path),
            text: trimmedText,
        };
    }
    /**
     * Điều chỉnh range để loại bỏ khoảng trắng đầu/cuối.
     * Đảm bảo các vị trí sau khi dịch chuyển không rơi vào bên trong isObject element
     * (ví dụ: variable widget đã bound) để tránh lỗi document-selection-wrong-position.
     */
    #adjustRangeForTrim(range, leadingTrim, trailingTrim) {
        const model = this.editor.model;
        /** Kiểm tra pos có hợp lệ (không nằm bên trong isObject element) */
        const isValidPosition = (pos) => {
            try {
                // path.length > 2 nghĩa là position nằm sâu hơn paragraph → bên trong element
                if (pos.path && pos.path.length > 2)
                    return false;
                // Kiểm tra node tại vị trí đó
                const nodeAfter = pos.nodeAfter;
                const nodeBefore = pos.nodeBefore;
                // Không cho phép position bắt đầu/kết thúc bên trong isObject
                if (nodeAfter && model.schema.isObject(nodeAfter))
                    return true; // trước object = ok
                if (nodeBefore && model.schema.isObject(nodeBefore))
                    return true; // sau object = ok
                return model.schema.checkChild(pos, '$text') || true;
            }
            catch {
                return false;
            }
        };
        return model.change(writer => {
            let startPos = range.start;
            let endPos = range.end;
            // Dịch start position forward để bỏ khoảng trắng đầu
            if (leadingTrim > 0) {
                for (let i = 0; i < leadingTrim && startPos; i++) {
                    const nextPos = startPos.getShiftedBy(1);
                    if (nextPos && isValidPosition(nextPos)) {
                        startPos = nextPos;
                    }
                    else {
                        break;
                    }
                }
            }
            // Dịch end position backward để bỏ khoảng trắng cuối
            if (trailingTrim > 0) {
                for (let i = 0; i < trailingTrim && endPos; i++) {
                    const prevPos = endPos.getShiftedBy(-1);
                    if (prevPos && prevPos.isAfter(startPos) && isValidPosition(prevPos)) {
                        endPos = prevPos;
                    }
                    else {
                        break;
                    }
                }
            }
            return writer.createRange(startPos, endPos);
        });
    }
    // ========================================================================
    // INTERNAL HELPERS
    // ========================================================================
    #createMarker(comment) {
        const model = this.editor.model;
        try {
            model.change(writer => {
                const root = model.document.getRoot();
                if (!root) {
                    throw new Error('Document root not found');
                }
                const startPos = writer.createPositionFromPath(root, comment.startPath);
                const endPos = writer.createPositionFromPath(root, comment.endPath);
                const range = writer.createRange(startPos, endPos);
                // Validate: kiểm tra text tại range có khớp với originalText không
                const rangeText = this.#getTextFromRange(range);
                this.#log('Range text:', rangeText, 'range:', range);
                if (rangeText !== comment.originalText) {
                    this.#warn(`Marker text mismatch for comment ${comment.id}:`, `\n  Expected: "${comment.originalText}"`, `\n  Got: "${rangeText}"`, `\n  Trying to find text near original path...`);
                    // Thử tìm text gần path gốc
                    const searchRange = this.#config.searchRange ?? _a.DEFAULT_SEARCH_RANGE;
                    const foundRange = this.#findTextNearPath(comment.originalText, comment.startPath, comment.endPath, searchRange);
                    if (foundRange) {
                        this.#log('Found text at new position, updating paths');
                        // Cập nhật paths cho comment
                        comment.startPath = Array.from(foundRange.start.path);
                        comment.endPath = Array.from(foundRange.end.path);
                        writer.addMarker(`comment:${comment.id}`, {
                            range: foundRange,
                            usingOperation: true,
                            affectsData: false,
                        });
                        return;
                    }
                    throw new Error(`Failed to find text "${comment.originalText}" near original path`);
                }
                writer.addMarker(`comment:${comment.id}`, {
                    range,
                    usingOperation: true, // CKEditor tự động cập nhật vị trí
                    affectsData: false,
                });
            });
            return true;
        }
        catch (e) {
            this.#warn(`Failed to create marker for comment ${comment.id}:`, e);
            return false;
        }
    }
    /**
     * Tìm text trong document trong phạm vi ±searchRange nodes từ path gốc
     */
    #findTextNearPath(searchText, startPath, endPath, searchRange) {
        if (!searchText)
            return null;
        const model = this.editor.model;
        const root = model.document.getRoot();
        if (!root)
            return null;
        // TODO: Implement text search logic here
        // 1. Lấy vị trí start và end từ các path gốc
        // 2. Tìm kiếm trong phạm vi ±searchRange nodes từ các vị trí đó
        // 3. Trả về range nếu tìm thấy text, null nếu không tìm thấy
        return null;
    }
    #getTextFromRange(range) {
        let text = '';
        for (const item of range.getItems()) {
            if (item.is('$textProxy') || item.is('$text')) {
                text += item.data;
            }
        }
        return text;
    }
    #scrollToComment(id) {
        const marker = this.editor.model.markers.get(`comment:${id}`);
        if (!marker) {
            this.#warn('Marker not found for scroll:', id);
            return;
        }
        const editor = this.editor;
        const STICKY_OFFSET = 100; // Offset cho sticky toolbar
        try {
            // Get the model range from marker
            const modelRange = marker.getRange();
            // Convert model range to view range
            const viewRange = editor.editing.mapper.toViewRange(modelRange);
            // Convert view range to DOM range
            const domRange = editor.editing.view.domConverter.viewRangeToDom(viewRange);
            this.#log('DOM range start:', domRange.startContainer, domRange.startOffset);
            // Get the start position of the range
            let targetElement = domRange.startContainer;
            // If it's a text node, get its parent
            if (targetElement.nodeType === Node.TEXT_NODE) {
                targetElement = targetElement.parentElement;
            }
            this.#log('Target element:', targetElement);
            // Find .builder-container
            let scrollContainer = targetElement;
            while (scrollContainer && !scrollContainer.classList?.contains('builder-container')) {
                scrollContainer = scrollContainer.parentElement;
            }
            this.#log('Found scroll container:', scrollContainer);
            if (!scrollContainer) {
                this.#warn('No builder-container found');
                return;
            }
            // Get the target element's position relative to the container
            const containerRect = scrollContainer.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            const relativeTop = targetRect.top - containerRect.top + scrollContainer.scrollTop - STICKY_OFFSET;
            this.#log('Container top:', containerRect.top);
            this.#log('Target top:', targetRect.top);
            this.#log('Current scroll:', scrollContainer.scrollTop);
            this.#log('Relative top to scroll:', relativeTop);
            scrollContainer.scrollTo({ top: relativeTop, behavior: 'smooth' });
        }
        catch (e) {
            this.#warn('Error scrolling to comment:', e);
        }
    }
    #refreshView() {
        // Force view refresh để cập nhật marker classes
        // Reconvert tất cả comment markers để cập nhật classes của chúng
        const markers = this.editor.model.markers;
        for (const marker of markers) {
            if (marker.name.startsWith('comment:')) {
                this.editor.editing.reconvertMarker(marker.name);
            }
        }
    }
    #fireOnChange() {
        this.#config.onChange?.(this.comments);
    }
}
_a = CkCommentPlugin;

/**
 * Document Builder Utilities
 * Các hàm tiện ích cho document builder
 */
/**
 * Chuẩn hóa nội dung bằng cách chuyển đổi tất cả màu HSL và RGB sang hex
 * @param content - Nội dung HTML cần chuẩn hóa
 * @returns Nội dung đã được chuẩn hóa với màu hex
 */
function normalize(content) {
    let normalized = content;
    // Chuyển đổi HSL sang hex
    const hslRegex = /hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/gi;
    normalized = normalized.replace(hslRegex, (match, h, s, l) => {
        try {
            const hue = parseInt(h, 10);
            const saturation = parseInt(s, 10);
            const lightness = parseInt(l, 10);
            // Kiểm tra giá trị hợp lệ
            if (hue >= 0 && hue <= 360 && saturation >= 0 && saturation <= 100 && lightness >= 0 && lightness <= 100) {
                return ColorUtilities.hslToHex(hue, saturation, lightness);
            }
        }
        catch (error) {
            console.warn('Failed to convert HSL to hex:', error, match);
        }
        return match; // Giữ nguyên nếu không thể chuyển đổi
    });
    // Chuyển đổi RGB sang hex
    const rgbRegex = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi;
    normalized = normalized.replace(rgbRegex, (match, r, g, b) => {
        try {
            const red = parseInt(r, 10);
            const green = parseInt(g, 10);
            const blue = parseInt(b, 10);
            if (red >= 0 && red <= 255 && green >= 0 && green <= 255 && blue >= 0 && blue <= 255) {
                return ColorUtilities.rgbToHex(red, green, blue);
            }
        }
        catch (error) {
            console.warn('Failed to convert RGB to hex:', error, match);
        }
        return match;
    });
    return normalized;
}

export { PageNumberPlugin, getPresetColors, getColorPickerConfig, getFontSizeOptions, getHeadingOptions, HeadingPlugin, VariablePlugin,
  sanitizeVariableHtmlBoundSerializedHtml, TableCustom, ImageUploadPlugin, ImageCustomPlugin, PageOrientation, PasteHandler,
  HighlightRangePlugin, BlockSpace, CkCommentPlugin, normalize };
