export function MainPage(props) {
  const ExitLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    window.location.href = "/login";
  };

  return (
    <div className="items-center MainPage flex max-h-full flex-col">
      <div className="text-4xl italic">
        欢迎回来!用户{localStorage.getItem("uid")}
      </div>
      <mdui-button className="w-1/2" onClick={ExitLogin}>
        退出登陆
      </mdui-button>
    </div>
  );
}
