import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export type Themes = 'material' | 'dataviz'

const initChart = (element: HTMLDivElement, initialData = [], theme: Themes = 'material') => {
  am4core.unuseAllThemes();
  am4core.useTheme(am4themes_animated);

  if (theme === 'material') {
    am4core.useTheme(am4themes_material);
  } else if (theme === 'dataviz') {
    am4core.useTheme(am4themes_dataviz);
  }

  let chart = am4core.create(element, am4charts.XYChart);
  chart.hiddenState.properties.opacity = 0;

  chart.padding(0, 0, 0, 0);

  chart.zoomOutButton.disabled = true;

  chart.data = initialData;

  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.grid.template.location = 0;
  dateAxis.renderer.minGridDistance = 30;
  dateAxis.dateFormats.setKey("second", "ss");
  dateAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
  dateAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
  dateAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
  dateAxis.renderer.inside = true;
  dateAxis.renderer.axisFills.template.disabled = true;
  dateAxis.renderer.ticks.template.disabled = true;

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = true;
  valueAxis.interpolationDuration = 500;
  valueAxis.rangeChangeDuration = 500;
  valueAxis.renderer.inside = true;
  valueAxis.renderer.minLabelPosition = 0.05;
  valueAxis.renderer.maxLabelPosition = 0.95;
  valueAxis.renderer.axisFills.template.disabled = true;
  valueAxis.renderer.ticks.template.disabled = true;

  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.dateX = "date";
  series.dataFields.valueY = "value";
  series.interpolationDuration = 500;
  series.defaultState.transitionDuration = 0;
  series.tensionX = 0.8;

  chart.events.on("datavalidated", function () {
    dateAxis.zoom({ start: 1 / 15, end: 1.2 }, false, true);
  });

  dateAxis.interpolationDuration = 500;
  dateAxis.rangeChangeDuration = 500;

  // all the below is optional, makes some fancy effects
  // gradient fill of the series
  series.fillOpacity = 1;
  let gradient = new am4core.LinearGradient();
  gradient.addColor(chart.colors.getIndex(0), 0.2);
  gradient.addColor(chart.colors.getIndex(0), 0);
  series.fill = gradient;

  // this makes date axis labels to fade out
  dateAxis.renderer.labels.template.adapter.add("fillOpacity", function (fillOpacity, target) {
    let dataItem = target.dataItem;
    return dataItem.position;
  })

  // need to set this, otherwise fillOpacity is not changed and not set
  dateAxis.events.on("validated", function () {
    am4core.iter.each(dateAxis.renderer.labels.iterator(), function (label) {
        label.fillOpacity = label.fillOpacity;
    })
  })

  // this makes date axis labels which are at equal minutes to be rotated
  dateAxis.renderer.labels.template.adapter.add("rotation", function (rotation, target) {
    let dataItem = target.dataItem;
    //@ts-ignore
    if (dataItem.date && dataItem.date.getTime() == am4core.time.round(new Date(dataItem.date.getTime()), "minute").getTime()) {
      target.verticalCenter = "middle";
      target.horizontalCenter = "left";
      return -90;
    }
    else {
      target.verticalCenter = "bottom";
      target.horizontalCenter = "middle";
      return 0;
    }
  })

  // bullet at the front of the line
  let bullet = series.createChild(am4charts.CircleBullet);
  bullet.circle.radius = 5;
  bullet.fillOpacity = 1;
  bullet.fill = chart.colors.getIndex(0);
  bullet.isMeasured = false;

  series.events.on("validated", function() {
    bullet.moveTo(series.dataItems.last.point);
    bullet.validatePosition();
  });

  return chart;
}

export default initChart;
