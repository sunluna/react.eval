<!DOCTYPE html>
<html>
<head>
  <titie></titie>
</head>
<body>
  react.eval
横向的react组件交互
<br/>
<pre>
 安装 
npm install react.eval --save

ps:
1.4.4之前为测试版本
</pre>
 <br/>
<p>
  &nbsp;</p>
被调用者
<pre style="font-family:新宋体;font-size:13;color:black;background:white;"><span style="color:blue;">import</span>&nbsp;React&nbsp;<span style="color:blue;">from</span>&nbsp;<span style="color:#a31515;">&#39;react&#39;</span>;
<span style="color:blue;">import</span>&nbsp;{&nbsp;react&nbsp;}&nbsp;<span style="color:blue;">from</span>&nbsp;<span style="color:#a31515;">&#39;react.eval&#39;</span>;

<span style="color:blue;">class</span>&nbsp;<span style="color:#2b91af;">BComponent</span>&nbsp;<span style="color:blue;">extends</span>&nbsp;<span style="color:#2b91af;">React</span>.Component&nbsp;{
&nbsp;&nbsp;<span style="color:blue;">constructor</span>(props)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:blue;">super</span>(props);
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:blue;">this</span>.state&nbsp;=&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content&nbsp;:&nbsp;<span style="color:#a31515;">&#39;nothing&#39;</span>
&nbsp;&nbsp;&nbsp;&nbsp;};
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;">//&nbsp;register&nbsp;instance&nbsp;for&nbsp;calling
</span>&nbsp;&nbsp;&nbsp;&nbsp;react.init(<span style="color:blue;">this</span>);
&nbsp;&nbsp;}
&nbsp;&nbsp;changeContent&nbsp;=&nbsp;(str)&nbsp;=&gt;&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;console.log(<span style="color:#a31515;">&quot;changing&quot;</span>+str);
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:blue;">this</span>.setState({
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content:str
&nbsp;&nbsp;&nbsp;&nbsp;});
&nbsp;&nbsp;}
&nbsp;&nbsp;render()&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:blue;">return</span>&nbsp;&lt;<span style="color:#844646;">p</span>&gt;<span style="color:#555555;">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Component&nbsp;</span>{<span style="color:blue;">this</span>.id}<span style="color:#555555;">:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{<span style="color:blue;">this</span>.state.content}<span style="color:#555555;">
&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;/<span style="color:#844646;">p</span>&gt;;
&nbsp;&nbsp;}
}
<span style="color:blue;">export</span>&nbsp;<span style="color:blue;">default</span>&nbsp;BComponent;

</pre>
调用者
<pre style="font-family:新宋体;font-size:13;color:black;background:white;"><span style="color:blue;">import</span>&nbsp;React&nbsp;<span style="color:blue;">from</span>&nbsp;<span style="color:#a31515;">&#39;react&#39;</span>;
<span style="color:blue;">import</span>&nbsp;{&nbsp;react&nbsp;}&nbsp;<span style="color:blue;">from</span>&nbsp;<span style="color:#a31515;">&#39;react.eval&#39;</span>;

<span style="color:blue;">class</span>&nbsp;<span style="color:#2b91af;">AComponent</span>&nbsp;<span style="color:blue;">extends</span>&nbsp;<span style="color:#2b91af;">React</span>.Component&nbsp;{
&nbsp;&nbsp;<span style="color:blue;">constructor</span>(props)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:blue;">super</span>(props);
&nbsp;&nbsp;}
&nbsp;&nbsp;render()&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:blue;">return</span>&nbsp;&lt;<span style="color:#844646;">p</span>&gt;<span style="color:#555555;">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;<span style="color:#844646;">button</span><span style="color:#555555;">&nbsp;onClick</span>={()&nbsp;=&gt;&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;">//&nbsp;id&nbsp;.&nbsp;methodName&nbsp;,arguments
</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;react.eval(<span style="color:#6464b9;">&#39;b.changeContent&#39;</span>,&nbsp;Math.random());
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}}&gt;<span style="color:#555555;">changeOtherComponent</span>&lt;/<span style="color:#844646;">button</span>&gt;<span style="color:#555555;">
&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;/<span style="color:#844646;">p</span>&gt;;
&nbsp;&nbsp;}
}
<span style="color:blue;">export</span>&nbsp;<span style="color:blue;">default</span>&nbsp;AComponent;

</pre>

界面
<pre style="font-family:新宋体;font-size:13;color:black;background:white;"><span style="color:blue;">import</span>&nbsp;React&nbsp;<span style="color:blue;">from</span>&nbsp;<span style="color:#a31515;">&#39;react&#39;</span>;
<span style="color:blue;">import</span>&nbsp;AComponent&nbsp;<span style="color:blue;">from</span>&nbsp;<span style="color:#a31515;">&#39;./eva&#39;</span>;
<span style="color:blue;">import</span>&nbsp;BComponent&nbsp;<span style="color:blue;">from</span>&nbsp;<span style="color:#a31515;">&#39;./evb&#39;</span>;

<span style="color:blue;">class</span>&nbsp;<span style="color:#2b91af;">TEval</span>&nbsp;<span style="color:blue;">extends</span>&nbsp;<span style="color:#2b91af;">React</span>.Component&nbsp;{
&nbsp;&nbsp;<span style="color:blue;">constructor</span>(props)&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:blue;">super</span>(props);
&nbsp;&nbsp;}
&nbsp;&nbsp;render()&nbsp;{
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:green;">//&nbsp;set&nbsp;id&nbsp;on&nbsp;BComponent&nbsp;
</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:blue;">return</span>&nbsp;(
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span style="color:#844646;">div</span>&gt;<span style="color:#555555;">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;<span style="color:#844646;">AComponent</span><span style="color:#555555;">&nbsp;</span>/&gt;<span style="color:#555555;">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;<span style="color:#844646;">BComponent</span><span style="color:#555555;">&nbsp;id</span>=<span style="color:#6464b9;">&quot;b&quot;</span>/&gt;<span style="color:#555555;">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;/<span style="color:#844646;">div</span>&gt;
&nbsp;&nbsp;&nbsp;&nbsp;);
&nbsp;&nbsp;}
}
<span style="color:blue;">export</span>&nbsp;<span style="color:blue;">default</span>&nbsp;TEval;
</pre>
<img src="readme/demo.png" class="auto-style1"/>
</body>
</html>