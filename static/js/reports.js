$(document).ready(function () {
    function analysis_data_fixed_cost_first() {
        total_graph_manipulation('#analysis-canvas-0');
    }
    function analysis_data() {
        var $InterviewsChart = $("#analysis-canvas-1");
        dataSite = {
            'bde_id': $('#id_bde').val(),
            'from_date': $('#id_from_date').val(),
            'to_date': $('#id_to_date').val(),
        }
        if(window.ChartInterview != undefined){
            window.ChartInterview.destroy();
        }
        $.ajax({
            url: $InterviewsChart.data("url"),
            data: dataSite,
            success: function (data) {
                var ctx_interview = $InterviewsChart[0].getContext("2d");
            window.ChartInterview = new Chart(ctx_interview, {
                    type: 'bar',
                    data: {
                        labels: data.interview_label,
                        datasets: [{
                            label: 'Rejected',
                            backgroundColor: '#F35550',
                            data: data.interview_total_status[0]
                        },
                        {
                            label: 'Scheduled',
                            backgroundColor: '#34AADC',
                            data: data.interview_total_status[1]
                        },
                        {
                            label: 'Move to next round',
                            backgroundColor: '#20B120',
                            data: data.interview_total_status[2]
                        },
                        {
                            label: 'Rescheduled Needed',
                            backgroundColor: '#036B84',
                            data: data.interview_total_status[3]
                        },
                        {
                            label: 'Selected',
                            backgroundColor: '#9551EB',
                            data: data.interview_total_status[4]
                        },
                        {
                            label: 'Closed',
                            backgroundColor: '#F5C980',
                            data: data.interview_total_status[5]
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
                            text: 'Monthly Interviews scheduled'
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
                                stacked: true
                            }],
                            xAxes: [{
                                stacked: true
                              }],
                        },
                        onClick: handleClickInterview
                    }
                });
                function handleClickInterview(evt)
                {
                    var activeElement = ChartInterview.getElementAtEvent(evt);
                    url = '/interviews/interview_list/?'
                    if (activeElement[0]._datasetIndex==0){
                       url += 'resource_status='+'rejected'
                    }else if(activeElement[0]._datasetIndex==1){
                       url += 'resource_status='+'scheduled'
                    }else if(activeElement[0]._datasetIndex==2){
                       url += 'resource_status='+'next_round'
                    }else if(activeElement[0]._datasetIndex==3){
                       url += 'resource_status='+'rescheduled_needed'
                    }else if(activeElement[0]._datasetIndex==4){
                       url += 'resource_status='+'selected'
                    }else if(activeElement[0]._datasetIndex==5){
                       url += 'resource_status='+'closed'
                    }
                        if (data.start_end_date_time_list.length==activeElement[0]._index+1){
                            url += '&from_date=' + dataSite.from_date + '&to_date=' + dataSite.to_date
                        } else{
                            url += '&from_date=' + data.start_end_date_time_list[activeElement[0]._index][0] + '&to_date=' + data.start_end_date_time_list[activeElement[0]._index][1]
                        }
                     if (data.bde_url){
                        url += '&' + data.bde_url
                    }
                    window.location.href = url
                    }
            }
        });
    }

    analysis_data()
    $('#filter_btn').click(function () {
        analysis_data()
    });
    analysis_data_fixed_cost_first()
    $('#filter_btn_fixed_cost_first').click(function () {
        analysis_data_fixed_cost_first()
    });
    $('#id_bde').on('change', function () {
        analysis_data()
    });
});