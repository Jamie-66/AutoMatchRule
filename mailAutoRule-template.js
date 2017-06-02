var template_Arr = [
 	{multiSelect_temp: `<div class="sear-group multi-select">
	        		      <div class="pro-sear sear-click"></div>
	        		    </div>`
	        		},

    {keyWord_temp: `<div><div class="form-search">
            		  <div class="select-count">已选 <span class="count-num">0</span> 项</div>
            		  <div class="clearfix">
            		    <label for="discount" class="form-search-key">关键词</label>
            		    <div class="col-xs-7">
            		      <div class="select-key-search">
            		        <input class="keywordContCol" type="text" value="" placeholder="请输入关键字">
            		        <i class="fa fa-search"></i>
            		      </div>
            		    </div>
            		    <div class="addWord">
            		      <button type="button" class="btn btn-sm btn-success addKeyWords" data-for="keyList">&nbsp;添加&nbsp;</button>
            		    </div>
            		  </div>
            		</div>
            		<div class="form-keyword form-group hidden">
            		  <div class="select-word">已添加关键词</div>
            		  <div class="select-multiple">
            		    <ul class="select_words_list">
            		    </ul>
            		  </div>
            		</div></div>`
            	},

    {Date_temp: `<div class="form-date">
  				   <div class="order-tip"><span>以天为单位，根据下面的条件来满足时间范围需求</span></div>
  				   <div class="form-range">
  				   <div class="clearfix upper">
  				     <div class="check-bar" data-range="upper"></div>
  				     <div class="col-xs-4 upper-bar date_range">
  				       <div class="select-cont-search">
  				         <select class="form-control input-sm date_range_select" data-range="upper" data-val="true" name="dateSelectUpper">
  				           <option value="0">请选择符号</option>
  				           <option value="≥">≥</option>
  				           <option value="=">=</option>
  				           <option value=">">></option>
  				         </select>
                   <div class="valid-text">
                     <span class="field-validation-error" data-valmsg-for="dateSelectLower" data-valmsg-replace="true"></span>
                   </div>
  				       </div>
  				     </div>
  				     <div class="col-xs-4 upper-bar date_input">
  				       <div class="select-cont-search">
  				         <input class="date-Input form-control" type="text" data-range="upper" data-rule="date" value="" placeholder="请输入天数" data-val="true" data-val-required="时间必须为正整数。" name="dateRangeUpper">
  				         <div class="valid-text">
                     <span class="field-validation-error" data-valmsg-for="dateRangeUpper" data-valmsg-replace="true"></span>
                   </div>
                 </div>
  				     </div>
  				     <span class="upper-date">/天</span>
  				   </div>
  				   <div class="clearfix lower">
  				     <div class="check-bar" data-range="lower"></div>
  				     <div class="col-xs-4 lower-bar date_range">
  				       <div class="select-cont-search">
  				         <select class="form-control input-sm date_range_select" data-range="lower" data-val="true" name="dateSelectLower">
  				           <option value="0">请选择符号</option>
  				           <option value="≤">≤</option>
  				           <option value="<"><</option>
  				         </select>
                   <div class="valid-text">
                     <span class="field-validation-error" data-valmsg-for="dateSelectLower" data-valmsg-replace="true"></span>
                   </div>
  				       </div>
  				     </div>
  				     <div class="col-xs-4 lower-bar date_input">
  				       <div class="select-cont-search">
  				         <input class="date-Input form-control" type="text" data-range="lower" data-rule="date" value="" placeholder="请输入天数" data-val="true" data-val-required="时间必须为正整数。" name="dateRangeLower">
  				         <div class="valid-text">
                     <span class="field-validation-error" data-valmsg-for="dateRangeLower" data-valmsg-replace="true"></span>
                   </div>
                 </div>
  				     </div>
  				     <span class="lower-date">/天</span>
  				   </div>
  				   </div>
  				 </div>`
  				},
  	{Value_temp: `<div class="form-date">
  				   <div class="order-tip"><span>以美元为单位，根据下面的条件来满足价值范围需求</span></div>
  				   <div class="form-range">
  				   <div class="clearfix upper">
  				     <div class="check-bar" data-range="upper"></div>
  				     <div class="col-xs-4 upper-bar date_range">
  				       <div class="select-cont-search">
  				         <select class="form-control input-sm date_range_select" data-range="upper" name="valueSelectUpper">
  				           <option value="0">请选择符号</option>
  				           <option value="≥">≥</option>
  				           <option value="=">=</option>
  				           <option value=">">></option>
  				         </select>
                   <div class="valid-text">
                     <span class="field-validation-error" data-valmsg-for="valueSelectUpper" data-valmsg-replace="true"></span>
                   </div>
  				       </div>
  				     </div>
  				     <div class="col-xs-4 upper-bar date_input">
  				       <div class="select-cont-search">
  				         <input class="date-Input form-control" type="text" data-rule="value" data-range="upper" value="" placeholder="请输入数字" data-val="true" data-val-required="美元必须为正数。" name="valueRangeUpper">
  				         <div class="valid-text">
                     <span class="field-validation-error" data-valmsg-for="valueRangeUpper" data-valmsg-replace="true"></span>
                   </div>
                 </div>
  				     </div>
  				     <span class="upper-date">/美元</span>
  				   </div>
  				   <div class="clearfix lower">
  				     <div class="check-bar" data-range="lower"></div>
  				     <div class="col-xs-4 lower-bar date_range">
  				       <div class="select-cont-search">
  				         <select class="form-control input-sm date_range_select" data-range="lower" name="valueSelectLower">
  				           <option value="0">请选择符号</option>
  				           <option value="≤">≤</option>
  				           <option value="<"><</option>
  				         </select>
                   <div class="valid-text">
                     <span class="field-validation-error" data-valmsg-for="valueSelectLower" data-valmsg-replace="true"></span>
                   </div>
  				       </div>
  				     </div>
  				     <div class="col-xs-4 lower-bar date_input">
  				       <div class="select-cont-search">
  				         <input class="date-Input form-control" type="text" data-rule="value" data-range="lower" value="" placeholder="请输入数字" data-val="true" data-val-required="美元必须为正数。" name="valueRangeLower">
  				         <div class="valid-text">
                     <span class="field-validation-error" data-valmsg-for="valueRangeLower" data-valmsg-replace="true"></span>
                   </div>
                 </div>
  				     </div>
  				     <span class="lower-date">/美元</span>
  				   </div>
  				   </div>
  				 </div>`
  				}
  			];



