$(document).ready(function () {
    $('#analysis-chart-1, #analysis-chart-2, #analysis-chart-3, #analysis-chart-4').attr('hidden', false)
    $('#analysis-chart-1, #analysis-chart-3').addClass('col-lg-8').removeClass('col-lg-6')
    $('#analysis-chart-2, #analysis-chart-4').addClass('col-lg-4').removeClass('col-lg-6')
    function analysis_data_fixed_cost_first() {
         total_graph_manipulation('.chart');
    }
    // fixed_cost_request
    function analysis_data_fixed_cost() {
        var $FixedCostChart = $(".chart");
        data_fixed_cost = {
            'id_bde_fixed_cost': $('#id_bde_fixed_cost').val(),
            'from_date': $('#id_from_date').val(),
            'to_date': $('#id_to_date').val(),
        }
        if(window.ChartClient != undefined || window.ChartLeadType != undefined || window.ChartWonLost != undefined || window.ChartLeadSource != undefined){
            window.ChartClient.destroy();
            window.ChartLeadType.destroy();
            window.ChartWonLost.destroy();
            window.ChartLeadSource.destroy();
        }
        $.ajax({
            url: $FixedCostChart.data("url"),
            data: data_fixed_cost,
            success: function (data) {
                var ctx_client = $FixedCostChart[1].getContext("2d");
                var ctx_lead_type = $FixedCostChart[2].getContext("2d");
                var ctx_won_lost = $FixedCostChart[3].getContext("2d");
                var ctx_lead_source = $FixedCostChart[4].getContext("2d");
                window.ChartClient = new Chart(ctx_client, {
                    type: 'line',
                    data: {
                        labels: data.fixed_cost_request_label,
                        datasets: [{
                            backgroundColor: '#1C9DB9',
                            data: data.fixed_cost_request_total,
                            borderRadius: 20,
                        }]
                    },
                    options: {
                    maintainAspectRatio: false,
                        tooltips: {
                             intersect: false
                          },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value) {if (value % 1 === 0) {return value;}}
                                },
//                                stacked: true
                            }],
                            xAxes: [{
//                                stacked: true
                              }],
                        },
                        legend: {
                      display: false
                    },
                        onClick: handleClickClients
                    },
                    plugins: [{
                        afterDraw: chart => {
                            if (chart.tooltip._active && chart.tooltip._active.length) {
                                let x = chart.tooltip._active[0].tooltipPosition().x;
                                let ctx = chart.ctx,
                                topY = chart.legend.bottom,
                                bottomY = chart.chartArea.bottom;
                                ctx.save();
                                ctx.beginPath();
                                ctx.moveTo(x, topY);
                                ctx.lineTo(x, bottomY);
                                ctx.lineWidth = 2;
                                ctx.strokeStyle = '#1C9DB9';
                                ctx.stroke();
                                ctx.restore();
                            }
                        }
                    },
                    ],
                });
                function handleClickClients(evt)
                {
                    var activeElement = ChartClient.getElementAtEvent(evt);
                    url = '/fixed_cost/list/?'
                    if (!(data_fixed_cost.from_date || data_fixed_cost.to_date) && (data.start_end_date_time_list.length==activeElement[0]._index+1)){
                            url += '&from_date=' + data.start_end_date_time_list[activeElement[0]._index][0] + '&to_date=' + data.to_date
                        } else if(!(data_fixed_cost.from_date || data_fixed_cost.to_date)){
                            url += '&from_date=' + data.start_end_date_time_list[activeElement[0]._index][0] + '&to_date=' + data.start_end_date_time_list[activeElement[0]._index][1]
                        } else{
                            url += '&from_date=' + data_fixed_cost.from_date + '&to_date=' + data_fixed_cost.to_date
                        }
                    if (data.bde_url){
                        url += '&' + data.bde_url
                    }
                    window.location.href = url
                }
                window.ChartLeadType = new Chart(ctx_lead_type, {
                    type: 'doughnut',
                    data: {
                        labels: ['Inbound - RFP', 'Outbound', 'Existing', 'Reference'],

                        datasets: [{
                            data: [data.data[12], data.data[13], data.data[14], data.data[15]],
                            backgroundColor: ['#6754C1', '#1C9DB9', '#49B854', '#EA8B37'],
                            hoverOffset: 5
                            }],
                    },
                    options: {
                        maintainAspectRatio: false,
                        responsive: true,
                        legend: {
                            position: 'bottom',
                            align: 'start',
                            labels: {
                              usePointStyle: true,
                            },
                        },
                        plugins:{
                            doughnutlabel: {
                                labels: [
                                  {text: '',},
                                  {text: '',},
                                  {text: '',},
                                  {text: '',},
                                  {text: '',},
                                  {text: '',},
                                  {text: '',},
                                  {text: '',},
                                  {
                                    text: 'Total Lead',
                                    font: {
                                      size: 20,
                                      weight: 'normal',
                                    },
                                  },
                                  {
                                    text: data.lead_type_total,
                                    font: {
                                      size: 20,
                                      weight: 'bold',
                                    },
                                  },
                                ],
                              },
                        },
                        tooltips: {
                          callbacks: {
                            title: () => null,
                          },
                        },
                        title: {
                            display: false,
//                            text: 'Lead Sources'
                        },
                        scales: {
//                            yAxes: [{
////                                ticks: {
////                                    beginAtZero: true,
////                                    callback: function(value) {if (value % 1 === 0) {return value;}}
////                                }
//                            }]
                        },
                        rotation: 1 * Math.PI,
                        circumference: 1 * Math.PI,
                        onClick: handleClickLeadType
                    }
                });
                function handleClickLeadType(evt)
                {
                    var activeElement = ChartLeadType.getElementAtEvent(evt);
                    if (activeElement[0]['_index']==0){
                        data.url += '&lead_type='+'inbound_rpf'
                    }else if(activeElement[0]['_index']==1){
                        data.url += '&lead_type='+'outbound'
                    }else if(activeElement[0]['_index']==2){
                        data.url += '&lead_type='+'existing'
                    }else if(activeElement[0]['_index']==3){
                        data.url += '&lead_type='+'reference'
                    }
                    data.url +=  '&' + data.start_date_url + data.end_date_url
                    window.location.href = data.url
                    }
                window.ChartWonLost = new Chart(ctx_won_lost, {
                    type: 'bar',
                    data: {
                        labels: data.interview_label,
                        datasets: [{
                            barPercentage: 0.9,//thickness
                            categoryPercentage: 0.2,//space between two bars

                            label: 'Won',
                            backgroundColor: '#1C9DB9',
                            data: data.interview_total_status[0],
                            borderRadius: 20,
                        },
                        {
                            barPercentage: 0.9,//thickness
                            categoryPercentage: 0.2,//space between two bars

                            label: 'Lost',
                            backgroundColor: '#EA8B37',
                            data: data.interview_total_status[1],
                            borderRadius: 20,
                        }]
                    },
                    options: {
                    maintainAspectRatio: false,
                        responsive: true,
                        legend: {
                            position: 'top',
                            align: 'start',
                        },
                        title: {
                            display: true,
                        },
                         interaction: {
                          intersect: false,
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value) {if (value % 1 === 0) {return value;}}
                                },
//                                stacked: true
                            }],
                            xAxes: [{
//                                stacked: true
                              }],
                        },
                        onClick: handleClickCurrentStatus
                    }
                });
                function handleClickCurrentStatus(evt)
                {
                    var activeElement = ChartWonLost.getElementAtEvent(evt);
                    if (activeElement[0]._datasetIndex==0){
                        data.url += '&current_status='+'closed_won'
                    }else if(activeElement[0]._datasetIndex==1){
                        data.url += '&current_status='+'closed_lost'
                    }
                    if (!(data_fixed_cost.from_date || data_fixed_cost.to_date) && (data.start_end_date_time_list.length==activeElement[0]._index+1)){
                            data.url += '&from_date=' + data.start_end_date_time_list[activeElement[0]._index][0] + '&to_date=' + data.to_date
                        } else if(!(data_fixed_cost.from_date || data_fixed_cost.to_date)){
                            data.url += '&from_date=' + data.start_end_date_time_list[activeElement[0]._index][0] + '&to_date=' + data.start_end_date_time_list[activeElement[0]._index][1]
                        } else{
                            data.url += '&from_date=' + data_fixed_cost.from_date + '&to_date=' + data_fixed_cost.to_date
                        }
                    window.location.href = data.url
                    }
                window.ChartLeadSource = new Chart(ctx_lead_source, {
                    type: 'doughnut',
                    data: {
                        labels: ['Freelance Job Portal', 'Google Jobs', 'LinkedIn Jobs', 'General Reachout – Email', 'General Reachout – LinkedIn/Sales Navigator', 'Inbound Inquiry - RFP',
                        'Solution Partners Directory', 'Reference', 'Other'],

                        datasets: [{
                            data: [data.data[1], data.data[2], data.data[3], data.data[4], data.data[5], data.data[6], data.data[7], data.data[8], data.data[9]],
                            backgroundColor: ['#6754C1', '#1C9DB9', '#49B854', '#EA8B37', '#4C65BC', '#C154BD', '#EAAD37', '#49B8A4', '#E74646'],
                            hoverOffset: 5
                            }],
                    },
                    options: {
                        maintainAspectRatio: false,
                        responsive: true,
                        legend: {
                            position: 'bottom',
                            align: 'start',
                             labels: {
                              usePointStyle: true,
                            },
                        },
                        tooltips: {
                          callbacks: {
                            title: () => null,
                          },
                        },
                        title: {
                            display: true,
                            align: 'center',
                        },

                        scales: {
//                            yAxes: [{
//                                ticks: {
//                                    beginAtZero: true,
//                                    callback: function(value) {if (value % 1 === 0) {return value;}}
//                                }
//                            }]
                        },
                        onClick: handleClickInterview
                    }
                });
                 function handleClickInterview(evt)
                {
                    var activeElement = ChartLeadSource.getElementAtEvent(evt);
                    if (activeElement[0]['_index']==0){
                        data.url += '&list_of_sources='+'FREELANCE_JOB_PORTAL'
                    }else if(activeElement[0]['_index']==1){
                        data.url += '&list_of_sources='+'GOOGLE_JOBS'
                    }else if(activeElement[0]['_index']==2){
                        data.url += '&list_of_sources='+'LINKEDIN_JOBS'
                    }else if(activeElement[0]['_index']==3){
                        data.url += '&list_of_sources='+'GENERAL_REACHOUT_EMAIL'
                    }else if(activeElement[0]['_index']==4){
                        data.url += '&list_of_sources='+'GENERAL_REACHOUT_LINKEDIN_OR_SALES_NAVIGATOR'
                    }else if(activeElement[0]['_index']==5){
                        data.url += '&list_of_sources='+'INBOUND_INQUIRY_RPF'
                    }else if(activeElement[0]['_index']==6){
                        data.url += '&list_of_sources='+'SOLUTION_PARTNERS_DIRECTORY'
                    }else if(activeElement[0]['_index']==7){
                        data.url += '&list_of_sources='+'REFERENCE'
                    }else if(activeElement[0]['_index']==8){
                        data.url += '&list_of_sources='+'OTHER'
                    }
                    data.url +=  '&' + data.start_date_url + data.end_date_url
                    window.location.href = data.url
                    }
            }
        });
    }

    analysis_data_fixed_cost()
    $('#filter_btn_fixed_cost').click(function () {
        analysis_data_fixed_cost()
    });
    $('#id_bde_fixed_cost').on('change', function () {
        analysis_data_fixed_cost()
    });
    analysis_data_fixed_cost_first()
    $('#filter_btn_fixed_cost_first').click(function () {
        analysis_data_fixed_cost_first()
    });
    $('#chart_select_fixed_cost').on('change', function () {
        if ($(this).val() == 'All') {
            $('#analysis-chart-1, #analysis-chart-2, #analysis-chart-3, #analysis-chart-4').attr('hidden', false)
            $('#analysis-chart-1, #analysis-chart-3').addClass('col-lg-8').removeClass('col-lg-12')
            $('#analysis-chart-2, #analysis-chart-4').addClass('col-lg-4').removeClass('col-lg-12')
        }
        if ($(this).val() == 'Lead Per BD') {
            $('#analysis-chart-2, #analysis-chart-3, #analysis-chart-4').attr('hidden', true)
            $('#analysis-chart-1').attr('hidden', false).addClass('col-lg-12').removeClass('col-lg-6');

        }
        if ($(this).val() == 'Lead Type') {
            $('#analysis-chart-2').attr('hidden', false).addClass('col-lg-12').removeClass('col-lg-6')
            $('#analysis-chart-1, #analysis-chart-3, #analysis-chart-4').attr('hidden', true)
        }
        if ($(this).val() == 'Project Won & Lost') {
            $('#analysis-chart-3').attr('hidden', false).addClass('col-lg-12').removeClass('col-lg-6')
            $('#analysis-chart-1, #analysis-chart-2, #analysis-chart-4').attr('hidden', true)
        }
        if ($(this).val() == 'Lead Sources') {
            $('#analysis-chart-4').attr('hidden', false).addClass('col-lg-12').removeClass('col-lg-6')
            $('#analysis-chart-1, #analysis-chart-2, #analysis-chart-3').attr('hidden', true)
        }
    });
});