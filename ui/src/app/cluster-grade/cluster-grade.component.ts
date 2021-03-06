import {Component, OnInit} from '@angular/core';
import {ClusterGradeService} from './cluster-grade.service';
import {ClusterResult} from './grade';

const pieChartOptions = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 10,
    data: ['严重', '警告', '通过']
  },
  color: ['hsl(9, 100%, 43%)', 'hsl(43, 100%, 42%)', 'hsl(93, 100%, 26%)'],
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '30',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [
        {value: 0, name: '严重'},
        {value: 0, name: '警告'},
        {value: 0, name: '通过'},
      ]
    }
  ]
};

const barChartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['严重', '警告', '通过']
  },
  color: ['hsl(9, 100%, 43%)', 'hsl(43, 100%, 42%)', 'hsl(93, 100%, 26%)'],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    data: ['镜像', '安全', '资源', '网络', '健康检查']
  },
  series: [
    {
      name: '严重',
      type: 'bar',
      stack: '总量',
      label: {
        position: 'insideRight'
      },
      data: []
    },
    {
      name: '警告',
      type: 'bar',
      stack: '总量',
      label: {
        position: 'insideRight'
      },
      data: []
    },
    {
      name: '通过',
      type: 'bar',
      stack: '总量',
      label: {
        position: 'insideRight'
      },
      data: []
    },
  ]
};

@Component({
  selector: 'app-cluster-conformance',
  templateUrl: './cluster-grade.component.html',
  styleUrls: ['./cluster-grade.component.css']
})
export class ClusterGradeComponent implements OnInit {

  constructor(private service: ClusterGradeService) {
  }

  data: ClusterResult;
  pieChartOptions = {};
  barChartOptions;
  loading = true;

  ngOnInit() {
    const id = 'd6e0af80-e3fb-42fe-8542-76159fdb9226';
    this.service.getGradeData(id).subscribe(data => {
      this.data = data;
      this.loading = false;
      this.pieChartOptions = pieChartOptions;
      this.barChartOptions = barChartOptions;
      this.pieChartOptions['series'][0].data = [
        {value: this.data.summary.totals.errors, name: '严重'},
        {value: this.data.summary.totals.warnings, name: '警告'},
        {value: this.data.summary.totals.successes, name: '通过'},
      ];
      this.barChartOptions.yAxis.data = [];
      for (const category in this.data.summary.by_category) {
        if (category) {
          this.barChartOptions.yAxis.data.push(category);
          this.barChartOptions.series[0].data.push(this.data.summary.by_category[category]['errors']);
          this.barChartOptions.series[1].data.push(this.data.summary.by_category[category]['warnings']);
          this.barChartOptions.series[2].data.push(this.data.summary.by_category[category]['successes']);
        }
      }
    });
  }


}
