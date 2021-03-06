var photoChange;
var gradeClassification;
require(["esri/Map", "esri/views/MapView", "esri/layers/GeoJSONLayer", "esri/widgets/Search", "esri/widgets/Expand"],
	function(Map, MapView,
		GeoJSONLayer, Search, Expand) {
//定义地图基本要素
		var map = new Map({
			basemap: "topo",
		});
		var view = new MapView({
			container: "mapDiv",
			map: map,
			scale: 25000000,
			center: [114, 31],
			popup: {
				actions: [],
				dockEnabled: true, //停靠在右侧
				dockOptions: {
					buttonEnabled: true, //显示停靠按钮
					breakpoint: false,
					position: "bottom-right",
				}
			}
		});
		
//诗词点的弹出框
		const allPointsTemplate = {
			title: "诗词点信息",
			content: "诗词名称： {poemname} <br/>朝代：{dynasty} <br/>作者：{poet} <br/>地址：{plocation} " +
				"<br/>分类：{grade:gradeClassification}" +
				"<br/>图片：{PoemPHOTOS:photoChange}",
		};
		gradeClassification = function(value, key, data) {
			var upArrow = "暂无分类";
			var downArrow = "" + data.grade + "";
			console.log(data.grade);
			var arrow = data.grade != "null" ? downArrow : upArrow;
			return (
				arrow
			);
		};
		photoChange = function(value, key, data) {
			var upArrow = "暂无图片";
			var downArrow = "<br/> <img src='images/" + data.PoemPHOTOS + ".jpg' alt = '暂无图片'/>";
			var arrow = data.PoemPHOTOS != "null" ? downArrow : upArrow;
			return (
				arrow
			);
		};
//按朝代渲染点，太丑了没用
		const allPointsRenderer = {
			type: "unique-value",
			field: "dynasty",
			defaultSymbol: {
				type: "simple-marker",
				color: "black",
				outline: {
					color: "white"
				}
			},
			uniqueValueInfos: [{
				value: "先秦",
				symbol: {
					type: "simple-marker",
					color: "red",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "两汉",
				symbol: {
					type: "simple-marker",
					color: "orange",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "魏晋",
				symbol: {
					type: "simple-marker",
					color: "#FF00FF",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "南北朝",
				symbol: {
					type: "simple-marker",
					color: "#FFFF00",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "隋代",
				symbol: {
					type: "simple-marker",
					color: "#006400",
					outline: {
						color: "white"
					}
				}
			}, {

				value: "唐代",
				symbol: {
					type: "simple-marker",
					color: "aqua",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "五代",
				symbol: {
					type: "simple-marker",
					color: "brown",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "宋代",
				symbol: {
					type: "simple-marker",
					color: "chartreuse",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "金朝",
				symbol: {
					type: "simple-marker",
					color: "mistyrose",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "元代",
				symbol: {
					type: "simple-marker",
					color: "darkgoldenrod",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "明代",
				symbol: {
					type: "simple-marker",
					color: "teal",
					outline: {
						color: "white"
					}
				}
			}, {
				value: "清代",
				symbol: {
					type: "simple-marker",
					color: "steelblue",
					outline: {
						color: "white"
					}
				}
			}]
		};
//诗词点总图层
		const allPoints = new GeoJSONLayer({
			// url: "https://liguiye.github.io/MapofPoetry/public/data/allPoints.json",
			url: "data/allPoints.json",
			copyright: "All Poem Points",
			popupTemplate: allPointsTemplate,
			outFields: ["*"]
			//renderer: allPointsRenderer
		});
		map.add(allPoints);
//搜索框
		var searchWidget = new Search({
			view: view,
			allPlaceholder: "请输入搜索内容",
			sources: [{
				layer: allPoints,
				searchFields: ["poet", "poemname", "dynasty"],
				suggestionTemplate: "{poemname}, {dynasty}, {poet},",
				exactMatch: false,
				outFields: ["*"],
				placeholder: "诗名/朝代/诗人/年级均可",
				name: "诗词搜索",
			}]
		});
		view.ui.add(searchWidget, {
			position: "top-right"
		});
		view.ui.add("titleDiv", "top-right");
// 疆域边界总图层
		const dynastyOutline = new GeoJSONLayer({
			// url: "https://liguiye.github.io/MapofPoetry/public/data/dynastyOutline.json",
			url: "data/dynastyOutline.json",
			copyright: "Dynasty Outline",
			outFields: ["*"]
		});
		map.add(dynastyOutline);
//地图刷新时默认为近代边界
		view.whenLayerView(dynastyOutline).then(function(layerView) {
			layerView.filter = {
				where: "dynasty = '近代'",
			};
		});
//左侧朝代筛选框
		let dynastyLayerView;
		let dynastyOutlineLayerView;
		const dynastyElement = document.getElementById("dynasty-filter");
		dynastyElement.addEventListener("click", filterBydynasty);
		// 获取页面选择的朝代并进行过滤
		function filterBydynasty(event) {
			const selecteddynasty = event.target.getAttribute("data-dynasty");
			dynastyLayerView.filter = {
				where: "dynasty = '" + selecteddynasty + "'"
			};
			dynastyOutlineLayerView.filter = dynastyLayerView.filter;
			document.getElementById("titleText").innerText = selecteddynasty;
			//选择朝代时更新标题
			switch (selecteddynasty) {
				case "先秦":
					document.getElementById("dynastyTime").innerText = "旧石器时期——公元前221年";
					break;
				case "两汉":
					document.getElementById("dynastyTime").innerText = "公元前202——220年";
					break;
				case "魏晋":
					document.getElementById("dynastyTime").innerText = "220年——420年";
					break;
				case "南北朝":
					document.getElementById("dynastyTime").innerText = "420年——581年";
					break;
				case "隋代":
					document.getElementById("dynastyTime").innerText = "581年——619年";
					break;
				case "唐代":
					document.getElementById("dynastyTime").innerText = "618年——907年";
					break;
				case "五代":
					document.getElementById("dynastyTime").innerText = "907年—960年";
					break;
				case "宋代":
					document.getElementById("dynastyTime").innerText = "960年—1279年";
					break;
				case "元代":
					document.getElementById("dynastyTime").innerText = "1271年—1368年";
					break;
				case "明代":
					document.getElementById("dynastyTime").innerText = "1368年―1644年";
					break;
				case "清代":
					document.getElementById("dynastyTime").innerText = "1636年—1912年";
					break;
				default:
					break;
			}
		}
		//更改地图显示
		view.whenLayerView(dynastyOutline).then(function(layerView) {
			dynastyOutlineLayerView = layerView;
			dynastyElement.style.visibility = "visible";
			const dynastyExpand = new Expand({
				view: view,
				content: dynastyElement,
				expandIconClass: "esri-icon-filter",
				group: "top-left",
				expandTooltip :"历代风骚",
			});
			//筛选框缩回去的时候显示所有点和近代边界
			dynastyExpand.watch("expanded", function() {
				if (!dynastyExpand.expanded) {
					dynastyLayerView.filter = null;
					dynastyOutlineLayerView.filter = {
						where: "dynasty = '近代'",
					};
					document.getElementById("titleText").innerText ="各朝代诗词点部分汇总";
					document.getElementById("dynastyTime").innerText = "先秦—清代(公元前221年—1912年)";
				}
			});
			view.ui.add(dynastyExpand, "top-left");
		});
		view.whenLayerView(allPoints).then(function(layerView) {
			dynastyLayerView = layerView;
		});
//左侧年级搜索框
		let gradeLayerView;
		const gradeElement = document.getElementById("grade-filter");
		gradeElement.addEventListener("click", filterBygrade);
		// 获取页面选择的年级并进行过滤
		function filterBygrade(event) {
			const selectedgrade = event.target.getAttribute("data-grade");
			gradeLayerView.filter = {
				where: "grade = '" + selectedgrade + "'"
			};
			document.getElementById("titleText").innerText = selectedgrade;
			document.getElementById("dynastyTime").innerText = "";
		}
		//更改地图显示
		view.whenLayerView(allPoints).then(function(layerView) {
			gradeLayerView = layerView;
			gradeElement.style.visibility = "visible";
			const gradeExpand = new Expand({
				view: view,
				content: gradeElement,
				expandIconClass: "esri-icon-authorize",
				group: "top-left",
				expandTooltip :"校园诗词",
			});
			//筛选框缩回去的时候显示所有点和近代边界
			gradeExpand.watch("expanded", function() {
				if (!gradeExpand.expanded) {
					dynastyLayerView.filter = null;
					dynastyOutlineLayerView.filter = {
						where: "dynasty = '近代'",
					};
					document.getElementById("titleText").innerText ="各朝代诗词点部分汇总";
					document.getElementById("dynastyTime").innerText = "先秦—清代(公元前221年—1912年)";
				}
			});
			view.ui.add(gradeExpand, "top-left");
		});







	});


$("#xianQin").click(function() {
	console.log("aaa");
});
