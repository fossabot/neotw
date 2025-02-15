(function () {
  'use strict';

  // tmp settings
  // var usernameTiddler = "neotw/username";
  // var username = $tw.wiki.getTiddlerText(usernameTiddler);
  // if(username !== "oeyoews")
  // {
  //   alert("This giscus tiddlywiki plugin just for oeyoews build after version 0.7.0")
  //   console.error("This giscus tiddlywiki plugin just for oeyoews build after version 0.7.0")
  //   return;
  // }

  var Widget = require('$:/core/modules/widgets/widget.js').widget;
  var GiscusNodeWidget = function (parseTreeNode, options) {
    this.initialise(parseTreeNode, options);
  };

  // ?? not suport repo-id filed, use repoId instead
  var giscusConfigTiddler = '$:/plugins/oeyoews/tiddlywiki-giscus/config';
  // console.log(giscusConfigTiddler)
  var giscusConfigTiddlerGet = $tw.wiki.getTiddler(giscusConfigTiddler);
  var config = giscusConfigTiddlerGet ? giscusConfigTiddlerGet.fields : {};
  // console.log(config)

  // debug
  // console.log(config.repo)
  // console.log(config.repoId)
  // console.log(config.categoryId)

  var repo = 'oeyoews/neotw';
  var repoId = 'R_kgDOH5A5OA';
  var categoryId = 'DIC_kwDOH5A5OM4CRFEE';

  GiscusNodeWidget.prototype = new Widget();
  GiscusNodeWidget.prototype.render = function (parent, nextSibling) {
    this.parentDomNode = parent;
    this.computeAttributes();
    this.execute();
    var id = this.getAttribute('id', '');
    var lang = this.getAttribute('lang', 'en');
    // var mapping = this.getAttribute("title", "title")
    var theme = this.getAttribute('theme', 'light');
    if (id === '') return;
    var scriptNode = this.document.createElement('script');
    scriptNode.setAttribute('src', 'https://giscus.app/client.js');

    scriptNode.setAttribute('data-repo', config.repo);
    scriptNode.setAttribute('data-repo-id', config.repoId);
    scriptNode.setAttribute('data-category', 'General');
    scriptNode.setAttribute('data-category-id', config.categoryId);

    scriptNode.setAttribute('data-mapping', 'specific');
    scriptNode.setAttribute('data-term', id);
    scriptNode.setAttribute('data-reactions-enabled', '1');
    scriptNode.setAttribute('data-emit-metadata', '1');
    scriptNode.setAttribute('data-input-position', 'top');
    scriptNode.setAttribute('data-loading', 'lazy');
    scriptNode.setAttribute('data-theme', theme);
    scriptNode.setAttribute('data-lang', lang);
    scriptNode.setAttribute('crossorigin', 'anonymous');
    scriptNode.setAttribute('async', 'true');
    // Clear other comment nodes' giscus class
    var commentNodes = this.document.querySelectorAll('.giscus');
    for (var i = 0, len = commentNodes.length; i < len; i++) {
      commentNodes[i].classList.remove('giscus');
    }
    // Find or create
    var commentNode = this.document.querySelector(
      '.oeyoews-giscus[tiddler-title="' + id.replace('"', '\\"') + '"]',
    );
    if (!commentNode) {
      commentNode = this.document.createElement('div');
      commentNode.setAttribute('class', 'giscus oeyoews-giscus');
      commentNode.setAttribute('tiddler-title', id);
      parent.insertBefore(commentNode, nextSibling);
      this.domNodes.push(commentNode);
    }
    parent.insertBefore(scriptNode, nextSibling);
    this.domNodes.push(scriptNode);
  };
  GiscusNodeWidget.prototype.execute = function () {};
  GiscusNodeWidget.prototype.refresh = function () {
    var changedAttributes = this.computeAttributes();
    if (Object.keys(changedAttributes).length > 0) {
      this.refreshSelf();
      return true;
    } else {
      return false;
    }
  };
  exports.giscus = GiscusNodeWidget;
})();
