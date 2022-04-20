import { DateCell, StringCell, IconCell, TemplateCell } from './my-data-table';

export const eventArchiveTable = [
	new DateCell({
		key: 'beginDateTime',
		label: 'Дата начала',
		sort: true
	}),
	new DateCell({
		key: 'endDateTime',
		label: 'Дата о-ия',
		sort: true
	}),
	new StringCell({
		key: 'zone',
		label: 'Зона',
	}),
	new IconCell({
		key: 'roadObject',
		label: 'У-во',
		sort: true,
		iconClass: 'circle-icon',
		svgPath: v => 'device/' + v.roadObject.properties.type + '/' + v.roadObject.properties.subType,
	}),
	new StringCell({
		key: 'index5',
		label: 'Расположение',
	}),
	new IconCell({
		key: 'type',
		label: 'Тип',
		sort: true,
		iconClass: 'circle-icon',
		svgPath: v => 'type/' + v.type?.code,
	}),
	new IconCell({
		key: 'priority',
		label: 'П-тет',
		sort: true,
		svgPath: v => 'priority/' + v.priority,
	}),
	new IconCell({
		key: 'status',
		label: 'С-ус',
		sort: true,
		iconClass: 'status-icon',
		svgPath: v => 'status/' + v.status,
	}),
	new IconCell({
		key: 'index',
		label: 'Службы',
		class: 'd-fx',
		iconClass: 'circle-icon mr-x2',
		svgPath: v => [
			'device/' + v.roadObject.properties.type + '/' + v.roadObject.properties.subType,
			'device/' + v.roadObject.properties.type + '/' + v.roadObject.properties.subType
		],
	}),
	new TemplateCell({
		key: 'thumbnail',
		label: 'Фото',
	}),
	new TemplateCell({
		key: 'files',
		label: 'Файлы',
	}),
	new StringCell({
		key: 'index12',
		label: 'Комментарий',
	}),
	new StringCell({
		key: 'index14',
		label: 'Оператор',
	}),
	new TemplateCell({
		key: 'more',
		label: 'Ещё',
		class: 'dynamic-table__more',
		stopRowEventPropagation: true
	}),
];

