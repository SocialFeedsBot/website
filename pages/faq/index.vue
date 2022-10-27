<template>
  <main>
    <div>
      <h1>FAQ</h1>
      <p>View frequently asked questions and a list of commands.</p>
      <div class="information-alert">
        Discord have deprecated bot commands, this means we no longer listen to commands beginning with
        '<code>sf!</code>'. Please use the dashboard to manage your feeds, or use Discord slash commands.
      </div>
    </div>

    <div class="container mt-2">
      <h2>How do I add a feed?</h2>
      <p>
        To add a feed, you can use any one of 2 options:<br><br>
      </p>
      <h3 class="top">
        Online dashboard:
      </h3>
      <p>
        Our online dashboard allows you to do this
        easily with minimal
        typing, to do so just press 'Login' and then the dropdown next to your name and then 'Servers'. Select your
        server and you are greeted with a
        page with all the details you need to add a feed.
      </p>
      <h3>
        Slash commands:
      </h3>
      <p>
        You can use a new feature called slash
        commands which all you have to do
        is type a slash (/) and type add. A list of feed types will come up and will guide you in adding a feed.<br><br>
      </p>

      <h2>
        My feed hasn't posted, what do I do?
      </h2>
      <p>
        We're constantly adding new features to the bot, we may temporarily bring some services down which will
        temporarily delay you from
        receiving feeds instantly. However the bot will always catch up when all services are restored.<br>
      </p>
      <h3>
        Don't think this is the case?
      </h3>
      <p>
        Be sure to check out our status
        page linked at the top
        of the page to see if any issues have already been reported. Otherwise, please join our support server and our
        staff team will help you.
      </p>
    </div>
  </main>
</template>

<style>
h1 {
  font-size: 3rem;
  margin-bottom: .75rem;
  font-weight: 600;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: .75rem;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: .75rem;
}

p {
  margin-top: 1rem;
  font-size: 1.1rem;
  line-height: 1.5;
}

.frame {
  height: 92vh;
  width: 100%;
  border: 0;
}

.information-alert {
  background-color: #4d72aa;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
