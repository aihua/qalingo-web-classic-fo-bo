(function( plugins ) {
    
    plugins.CatalogTree = {

        GET_CATALOG_AJAX : null,
        GET_PRODUCT_LIST_AJAX : null,

        catalogData : null,
        catalogType : null,
		
        init : function() {
			if($('#catalog-tree').length > 0){
				var ajaxUrls = context.urls;
				for(var i = 0; i < ajaxUrls.length; i++){
					if(ajaxUrls[i].code == 'GET_CATALOG_AJAX'){
						GET_CATALOG_AJAX = ajaxUrls[i];
					}
					if(ajaxUrls[i].code == 'GET_PRODUCT_LIST_AJAX'){
						GET_PRODUCT_LIST_AJAX = ajaxUrls[i];
					}
				}
				
				catalogType = $('#catalog-tree').attr('data-catalog-type');
				plugins.CatalogTree.loadCatalogAjax(catalogType);
				
			}			
        },
		
		loadCatalogAjax : function(catalogType) {
			var params = "catalog-type=" + catalogType;
			$.ajax({
				url: GET_CATALOG_AJAX.url,
				type: GET_CATALOG_AJAX.method,
				data: params,
				success : plugins.CatalogTree.loadCatalogHtml
				/*
				error : function(data) {
					catalogData = data;
				}
				*/
			});
        },

        loadCatalogHtml : function(catalog) {
			$("#add-root-category").attr('href', catalog.addRootCategoryUrl);
		
			var html = '<li><a href="#' + catalog.code + '">' + catalog.businessName + '</a><ul>';
			var  catalogCategories = catalog.catalogCategories;
			html = html + plugins.CatalogTree.loadCatalogCategoryTree(catalogCategories);
			html = html + '</ul></li>';
			$('#catalog-tree').html(html);
			
			$('.find-products').on('click', function() {
				var categoryCode = $(this).attr('data-category-code');
				plugins.CatalogTree.loadProductListAjax(categoryCode);
			});
		},
		
        loadCatalogCategoryTree : function(catalogCategories) {
			var html =	'';
			for(var i = 0; i < catalogCategories.length; i++){
				var category = catalogCategories[i];
				html = html + '<li><a href="#" class="find-products" data-category-code="' + category.code + '">' + category.businessName + '</a>';
				if(category.catalogCategories != null && category.catalogCategories.length > 0){
					html = html + '<ul>' + plugins.CatalogTree.loadCatalogCategoryTree(category.catalogCategories) + '</ul>';
				}
				html = html + '</li>';
			}
			return html;
		},
		
		loadProductListAjax : function(categoryCode) {
			var params = "category-code=" + categoryCode + "&" + "catalog-type=" + catalogType;
			$.ajax({
				url: GET_PRODUCT_LIST_AJAX.url,
				type: GET_PRODUCT_LIST_AJAX.method,
				data: params,
				success : plugins.CatalogTree.loadProductListHtml
				/*
				error : function(data) {
					catalogData = data;
				}
				*/
			});
        },
		
        loadProductListHtml : function(category) {	
			$("#category-name").html(category.businessName);
			$("#category-urls").html("<a href=\"" + category.addChildCategoryUrl + "\">add child category</a> | <a href=\"" + category.detailsUrl + "\">details</a> | <a href=\"" + category.editUrl + "\">edit</a>");
			var html = "";
			$.each(category.productMarketings, function(i, item){
				html = html + "<tr><td>" + item.code + "</td><td>" + item.businessName + "</td><td>" + item.position + "</td><td>" + item.productSkus.length + "</td><td><a href=\"" + item.detailsUrl + "\">d�tails</a> | <a href=\"" + item.editUrl + "\">�diter</a></td></tr>";
			});
			$("#product-list tbody").html(html);
		},
		
    };
    
})( window.plugins = window.plugins || {} );
