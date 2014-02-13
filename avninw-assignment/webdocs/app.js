$(function(){
	var totalEls = [];
	var updateValues = function(el){
		totalEls[el.id].val = el.value;
		$('#'+el.id+'-value').html(totalEls[el.id].val);
	};
		
	$.fn.extend({
		findThroughput:function(options,args){
			var defaults={

			};
			var opt = $.extend(defaults, options);

			var checkThroughtPut = function(el){									
				var val = el.val, 
					max = el.max,
					valpersentage = val/max*100;
					increaseStatus = '';

				if( valpersentage <= 50 ){
					increaseStatus = 'success';
				}
				else if( valpersentage > 50 && valpersentage <= 80){
					increaseStatus = 'warning';
				} else{
					increaseStatus = 'danger';
				}
				
				return increaseStatus;					
			};

			var _updateCategory = function(bwStatus, connStatus){
				var mapper = {'danger': 2, 'warning': 1, 'success': 0},
					bwMapVal = mapper[bwStatus],
					connMapVal = mapper[connStatus],
					status = '';
				switch (String(bwMapVal) + String(connMapVal)){
					case '00':
					case '10':
					case '20':
					case '21':
						status = 'success'
						break;
					case '11':	
					case '22':
						status = 'warning'
						break;
					case '01':
					case '02':
					case '12':
						status = 'danger';
						break;
					default:
						status = '';
				}
				$('#category p').attr('class', 'label label-'+status);
			};

			return this.each(function(){								
				var el = this, bwElementStatus,connElementStatus;								
				if(el.id.indexOf('bandwidth') != -1){
					bwElementStatus = checkThroughtPut(totalEls[el.id]);	
				}else{
					connElementStatus = checkThroughtPut(totalEls[el.id]);	
				}
				for (var e in totalEls) {
					if(e != el.id){
						if(e.indexOf('bandwidth') != -1){
							bwElementStatus = checkThroughtPut(totalEls[e]);	
						}else{
							connElementStatus = checkThroughtPut(totalEls[e]);
						}
					}
				}	
				_updateCategory(bwElementStatus,connElementStatus);								
			});
		}
	});

	$('.rangeEl').each(function(index,el){
		if($.inArray(el.id,totalEls) == -1){				
			totalEls[el.id] = {'mix':el.min,'max':el.max,'midVal': (el.max - el.min) / 2, 'val': el.value};								
		}						
	});

	$('.rangeEl').on('change',function(a){
		updateValues(this);
		totalEls[this.id].val = this.value;
		$(this).findThroughput();
	});
});